const Calculator = require('./Calculator');

/**
 * Set of methods.
 */
class GraphTradeHelper {
    /**
     * Calculates single path.
     *
     * @param {Pairs} pairsCollection
     * @param {String} currency Initial currency.
     * @param {Number} amount Initial amount.
     * @param {Array} path Path to calculate.
     *
     * @return {Calculator}
     *
     * @throws PriceLeqZero
     */
    static calculatePath(pairsCollection, currency, amount, path) {
        const balance = {};
        balance[currency] = amount;

        const calculator = new Calculator(
            pairsCollection,
            path,
            balance
        );
        calculator.setDebug(true);

        try {
            calculator.init();
        } catch(e) {
            throw e;
        }

        return calculator;
    }
}

module.exports = GraphTradeHelper;