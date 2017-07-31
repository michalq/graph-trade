"use strict";

const InfoService = require('../modules/bterClient/Info'),
    TickersService = require('../modules/bterClient/Tickers'),
    PairsCollection = require('./app/Pairs'),
    RelationsCollection = require('./app/Relations'),
    PairEntity = require('./app/Pair'),
    PathFinder = require('./app/PathFinder'),
    Calculator = require('./app/Calculator');


const pairsCollection = new PairsCollection;
const relationsCollection = new RelationsCollection;

Promise.all([
    InfoService.fetch(),
    TickersService.fetch()
]).then(data => {
    // Prepare data.
    const apiMarketInfo = data[0],
        apiTickers = data[1];

    for (let i = 0; i < apiMarketInfo.length; i++) {
        let pairName = Object.keys(apiMarketInfo[i])[0],
            pairDetails = apiMarketInfo[i][pairName],
            ticker = apiTickers[pairName];

        if (typeof ticker === 'undefined') {  continue; }

        let buyCurrency = ticker.getBuyCurrency(),
            sellCurrency = ticker.getSellCurrency(),
            sellPrice = ticker.getSell(),
            buyPrice = ticker.getBuy();

        relationsCollection.addRelation(
            buyCurrency,
            sellCurrency
        );

        relationsCollection.addRelation(
            sellCurrency,
            buyCurrency
        );

        pairsCollection.addPair((new PairEntity)
            .setBuyCurrency(buyCurrency)
            .setSellCurrency(sellCurrency)
            .setPrice(buyPrice)
            .setDecimalPlaces(pairDetails.decimal_places)
            .setFeePercent(pairDetails.fee)
        );

        pairsCollection.addPair((new PairEntity)
            .setBuyCurrency(sellCurrency)
            .setSellCurrency(buyCurrency)
            .setPrice(1 / sellPrice)
            .setDecimalPlaces(pairDetails.decimal_places)
            .setFeePercent(pairDetails.fee)
        );
    }

    // Prepare path finder.
    if (!relationsCollection.count()) {
        throw new Error('Relations collection is empty.');
    }

    const pathFinder = new PathFinder(relationsCollection);

    pathFinder.setInitial('btc');
    pathFinder.setDestination('btc');
    pathFinder.init();

    // Run calculator.
    let calculator,
        balance;
    const foundPaths = pathFinder.getPaths();

    for (let i = 0; i < foundPaths.length; i++) {
        balance = {btc: 1};
        calculator = new Calculator(
            pairsCollection,
            foundPaths[i],
            balance
        );
        calculator.setDebug(true);

        calculator.init();
        if (balance.btc > 1) {
            console.log('YAY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log(calculator.getDebugLogs());
            console.log(balance);
        }
    }

    // console.log(relationsCollection.getRelation('btc').getBuyPossibilities());
})
.catch(err => {
    console.error(err);
});