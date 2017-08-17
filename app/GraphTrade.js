"use strict";

const InfoService = require('../../modules/bterClient/Info'),
    TickersService = require('../../modules/bterClient/Tickers'),
    PairsCollection = require('./Pairs'),
    RelationsCollection = require('./Relations'),
    PairEntity = require('./Pair'),
    CurrencyEntity = require('./Currency'),
    PathFinder = require('./PathFinder'),
    Calculator = require('./Calculator'),
    Currencies = require('./Currencies');

// Errors
const PriceLeqZero = require('./errors/PriceLeqZero');

/**
 * Wrap together whole algorithm.
 *
 * @todo this class is ugly and should be refactored.
 */
class Wrapper {
    constructor(owningCurrency, amount) {
        this.owningCurrency = owningCurrency;
        this.amount = amount;
        this.pairsCollection = new PairsCollection;
        this.relationsCollection = new RelationsCollection;
    }

    /**
     * Fetches whole data.
     *
     * @return {Promise}
     */
    fetchData() {
        return Promise.all([
            InfoService.fetch(),
            TickersService.fetch()
        ]);
    }

    /**
     * @return {Promise}
     */
    init(){
        return this.fetchData().then(data => {
            // Prepare data.
            const apiMarketInfo = data[0],
                apiTickers = data[1],
                currenciesCollection = new Currencies(),
                currencies = currenciesCollection.get();

            //
            for (let i = 0; i < apiMarketInfo.length; i++) {
                let pairName = Object.keys(apiMarketInfo[i])[0],
                    pairDetails = apiMarketInfo[i][pairName],
                    ticker = apiTickers[pairName];

                if (typeof ticker === 'undefined') {
                    console.log('Omitting ticker for pair ' + pairName + ' is undefined.');
                    continue;
                }

                let buyCurrency = ticker.getBuyCurrency(),
                    sellCurrency = ticker.getSellCurrency(),
                    sellPrice = ticker.getSell(),
                    buyPrice = ticker.getBuy();

                if (typeof currencies[buyCurrency] === 'undefined') {
                    console.log('Cannot find details for [' + buyCurrency.toUpperCase() + '] currency.');
                    continue;
                }

                if (typeof currencies[sellCurrency] === 'undefined') {
                    console.log('Cannot find details for [' + sellCurrency.toUpperCase() + '] currency.');
                    continue;
                }

                this.relationsCollection.addRelation(
                    buyCurrency,
                    sellCurrency
                );

                this.relationsCollection.addRelation(
                    sellCurrency,
                    buyCurrency
                );

                this.pairsCollection.addPair((new PairEntity)
                    .setBuyCurrency(buyCurrency)
                    .setBuyCurrencyEntity(currencies[buyCurrency])
                    .setSellCurrency(sellCurrency)
                    .setSellCurrencyEntity(currencies[sellCurrency])
                    .setPrice(buyPrice)
                    .setDecimalPlaces(pairDetails.decimal_places)
                    .setFeePercent(pairDetails.fee)
                );

                this.pairsCollection.addPair((new PairEntity)
                    .setBuyCurrency(sellCurrency)
                    .setBuyCurrencyEntity(currencies[sellCurrency])
                    .setSellCurrency(buyCurrency)
                    .setSellCurrencyEntity(currencies[buyCurrency])
                    .setPrice(1 / sellPrice)
                    .setDecimalPlaces(pairDetails.decimal_places)
                    .setFeePercent(pairDetails.fee)
                );
            }

            // Prepare path finder.
            if (!this.relationsCollection.count()) {
                throw new Error('Relations collection is empty.');
            }

            const pathFinder = new PathFinder(this.relationsCollection);

            pathFinder.setInitial(this.owningCurrency);
            pathFinder.setDestination(this.owningCurrency);
            pathFinder.init();

            // Run calculator.
            let calculator,
                balance,
                valuablePaths = [];

            const foundPaths = pathFinder.getPaths();

            for (let i = 0; i < foundPaths.length; i++) {
                balance = {};
                balance[this.owningCurrency] = this.amount;

                calculator = new Calculator(
                    this.pairsCollection,
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
    }
}

module.exports = Wrapper;