"use strict";

const InfoService = require('../../modules/bterClient/Info'),
    TickersService = require('../../modules/bterClient/Tickers'),
    PairsCollection = require('../app/Pairs'),
    RelationsCollection = require('../app/Relations'),
    PairEntity = require('../app/Pair'),
    PathFinder = require('../app/PathFinder'),
    Calculator = require('../app/Calculator');

// Errors
const PriceLeqZero = require('../app/errors/PriceLeqZero');

const pairsCollection = new PairsCollection;
const relationsCollection = new RelationsCollection;

module.exports = Promise.all([
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
        balance,
        valuablePaths = [];

    const foundPaths = pathFinder.getPaths();

    for (let i = 0; i < foundPaths.length; i++) {
        balance = {btc: 1};
        calculator = new Calculator(
            pairsCollection,
            foundPaths[i],
            balance
        );
        calculator.setDebug(true);

        try {
            calculator.init();
        } catch(e) {
            if (e instanceof PriceLeqZero) {
                console.log(e.message);
            } else {
                throw e;
            }

            continue;
        }

        if (calculator.isPathValuable()) {
            valuablePaths.push(calculator);
        }
    }

    return Promise.resolve(valuablePaths);
});