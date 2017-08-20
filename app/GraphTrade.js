"use strict";

const InfoService = require('../../modules/bterClient/Info'),
    TickersService = require('../../modules/bterClient/Tickers'),
    PairsCollection = require('./Pairs'),
    RelationsCollection = require('./Relations'),
    PathFinder = require('./PathFinder'),
    Calculator = require('./Calculator'),
    PairsHelper = require('./PairsHelper');

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

            for (let i = 0; i < foundPaths.length; i++) {
                this.calculate(foundPaths[i]);
            }

            return Promise.resolve(this.valuablePaths);
        });
    }

    /**
     * Calculate single path.
     *
     * @param {Object} path
     *
     * @return {Bool}
     */
    calculate(path) {
        const balance = {};
        balance[this.owningCurrency] = this.amount;

        const calculator = new Calculator(
            this.pairsCollection,
            path,
            balance
        );
        calculator.setDebug(true);

        try {
            calculator.init();
        } catch(e) {
            if (e instanceof PriceLeqZeroError) {
                console.log(e.message);
            } else {
                throw e;
            }

            return false;
        }

        if (calculator.isPathValuable()) {
            this.valuablePaths.push(calculator);
        }

        return true;
    }
}

module.exports = Wrapper;