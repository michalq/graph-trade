"use strict";

const InfoService = require('../../modules/bterClient/Info'),
    TickersService = require('../../modules/bterClient/Tickers'),
    PairsCollection = require('./Pairs'),
    RelationsCollection = require('./Relations'),
    PairEntity = require('./Pair'),
    PathFinder = require('./PathFinder'),
    Calculator = require('./Calculator');

// Errors
const PriceLeqZero = require('./errors/PriceLeqZero');

/**
 * Wrap together whole algorithm.
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
                apiTickers = data[1];

            for (let i = 0; i < apiMarketInfo.length; i++) {
                let pairName = Object.keys(apiMarketInfo[i])[0],
                    pairDetails = apiMarketInfo[i][pairName],
                    ticker = apiTickers[pairName];

                if (typeof ticker === 'undefined') continue;

                let buyCurrency = ticker.getBuyCurrency(),
                    sellCurrency = ticker.getSellCurrency(),
                    sellPrice = ticker.getSell(),
                    buyPrice = ticker.getBuy();

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
                    .setSellCurrency(sellCurrency)
                    .setPrice(buyPrice)
                    .setDecimalPlaces(pairDetails.decimal_places)
                    .setFeePercent(pairDetails.fee)
                );

                this.pairsCollection.addPair((new PairEntity)
                    .setBuyCurrency(sellCurrency)
                    .setSellCurrency(buyCurrency)
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