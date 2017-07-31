/**
 *
 */
class Calculator {
    /**
     *
     * @param {Pairs} pairsCollection
     * @param {Path} path
     */
    constructor(pairsCollection, path, balance) {
        this.pairs = pairsCollection;
        this.path = path;
        this.balance = balance;
        this.debugMode = false;
        this.debugLogs = [];
    }

    /**
     *
     * @param {Bool} debugMode
     *
     * @return this
     */
    setDebug(debugMode) {
        this.debugMode = debugMode;
        return this;
    }

    /**
     * Returns debug logs.
     *
     * @return {Array}
     */
    getDebugLogs() {
        return this.debugLogs;
    }

    init() {
        let price,
            amountToBuy,
            totalPrice,
            currentStrategy,
            pair;

        for (let i = 0; i < this.path.path.length; i++) {
            currentStrategy = this.path.path[i];

            pair = this.pairs.getPair(currentStrategy.buy + '_' + currentStrategy.sell);
            if (typeof pair === 'undefined') {
                throw new Error('Pair [' + currentStrategy.buy + '_' + currentStrategy.sell + '] is not defined.');
            }

            price = pair.getPrice();
            if (price <= 0) {
                throw new Error('Price cannot be lass or equal 0.');
            }

            // Calculate how many can buy for that price.
            amountToBuy = this.balance[currentStrategy.sell] / price;
            totalPrice = price * amountToBuy;

            if (typeof this.balance[currentStrategy.buy] === 'undefined') {
                this.balance[currentStrategy.buy] = 0;
            }

            this.balance[currentStrategy.sell] -= totalPrice;
            this.balance[currentStrategy.buy] += amountToBuy;

            if (this.debugMode) {
                this.debugLogs.push(
                    'Buying ' + amountToBuy + '[' + currentStrategy.buy + '] for ' + totalPrice + '[' + currentStrategy.sell + ']'
                );
            }
        }
    }
}

module.exports = Calculator;