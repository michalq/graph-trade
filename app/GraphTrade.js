"use strict";

const InfoService = require('../../modules/bterClient/Info'),
    TickersService = require('../../modules/bterClient/Tickers'),
    PairsCollection = require('./Pairs'),
    RelationsCollection = require('./Relations'),
    PathFinder = require('./PathFinder'),
    Calculator = require('./Calculator'),
    PairsHelper = require('./PairsHelper'),
    GraphTradeHelper = require('./GraphTradeHelper');

const PriceLeqZeroError = require('./errors/PriceLeqZero');

/**
 * Wrap together whole algorithm.
 *
 * 1. Fetch information about pairs and trades,
 * 2. creates possible paths,
 * 3. calculates
 *
 * @todo this class is ugly and should be refactored.
 */
class Wrapper {
    constructor(owningCurrency, amount) {
        this.owningCurrency = owningCurrency;
        this.amount = amount;
        this.valuablePaths = [];
        this.relationsCollection = new RelationsCollection;
        this.pairsCollection = new PairsCollection;
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
                pairsHelper = new PairsHelper(apiMarketInfo, apiTickers);

            pairsHelper.findPairs()

            this.relationsCollection = pairsHelper.getRelations();
            this.pairsCollection = pairsHelper.getPairs();

            const pathFinder = new PathFinder(this.relationsCollection);

            pathFinder.setInitial(this.owningCurrency);
            pathFinder.setDestination(this.owningCurrency);
            pathFinder.init();

            const foundPaths = pathFinder.getPaths();

            let calculator;
            for (let i = 0; i < foundPaths.length; i++) {
                try {
                    calculator = GraphTradeHelper.calculatePath(
                        this.pairsCollection,
                        this.owningCurrency,
                        this.amount,
                        foundPaths[i]
                    );

                    if (calculator.isPathValuable()) {
                        this.valuablePaths.push(calculator);
                    }
                } catch(e) {
                    if (e instanceof PriceLeqZeroError) {
                        console.log(e.message);
                    } else {
                        throw e;
                    }
                }
            }

            return Promise.resolve(this.valuablePaths);
        });
    }
}

module.exports = Wrapper;