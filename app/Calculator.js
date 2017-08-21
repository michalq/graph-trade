const PriceNotValidError = require('./errors/PriceNotValidError'),
    PriceLeqZero = require('./errors/PriceLeqZero');

/**
 *
 */
class Calculator {
    /**
     * @param {Pairs} pairsCollection
     * @param {Path} path
     * @param {Object} initialBalance
     */
    constructor(pairsCollection, path, initialBalance) {
        if (typeof initialBalance !== 'object') {
            throw new Error('Initial balance should be object.');
        }

        const currencies = Object.keys(initialBalance);
        if (currencies.length > 1) {
            throw new Error('Initial balance should have only one currency.');
        }

        /** @type {Object} */
        this.testedCurrency = currencies[0];

        /** @type {Pairs} Available pairs. */
        this.pairs = pairsCollection;

        /** @type {Path} Trade path. */
        this.path = path;

        /** @type {Object} Balance that after run script may change. */
        this.balance = initialBalance;

        /** @type {Object} Initial balance. doesn't change after run script. */
        this.initialBalance = Object.assign({}, initialBalance);

        /** @type {Boolean} Should be stored debug logs. */
        this.debugMode = false;

        /** @type {Array} Debug logs. */
        this.debugLogs = [];
    }

    /**
     * Returns path.
     *
     * @return {Array}
     */
    getPath() {
        return this.path;
    }

    /**
     * Is path valuable.
     *
     * @return {Boolean}
     */
    isPathValuable() {
        return this.balance[this.testedCurrency] > this.initialBalance[this.testedCurrency];
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

    /**
     * Returns initial before calculation.
     *
     * @return {Object}
     */
    getInitialBalance() {
        return this.initialBalance;
    }

    /**
     * Returns balance.
     *
     * @return {Object}
     */
    getBalance() {
        return this.balance;
    }

    /**
     * Returns percent revenue after path calculations.
     *
     * @return {Number}
     */
    getPercentRevenue() {
        const initial = this.getInitialBalance()[this.testedCurrency];

        return Math.floor(((this.getBalance()[this.testedCurrency] - initial) / initial) * 10000) / 100;
    }

    /**
     * Run calculation.
     *
     * @return {this}
     */
    init() {
        let price,
            amountToBuy,
            totalPrice,
            currentStrategy,
            pair,
            pairName,
            buyDecimalMask,
            sellDecimalMask,
            fee;

        const includeFee = true;
        for (let i = 0; i < this.path.path.length; i++) {
            fee = 0.2 / 100;
            currentStrategy = this.path.path[i];

            pairName = currentStrategy.buy + '_' + currentStrategy.sell;
            pair = this.pairs.getPair(pairName);

            price = pair.getPrice();
            if (includeFee) {
                price += pair.getPrice() * fee;
            }

            if (price <= 0) {
                throw new PriceLeqZero(pair);
            }

            // Calculate how many can buy for that price.
            buyDecimalMask = Math.pow(10, pair.getBuyCurrency().getDecimalPlaces());
            amountToBuy = this.balance[currentStrategy.sell] / price;
            amountToBuy = Math.floor(amountToBuy * buyDecimalMask) / buyDecimalMask;

            // Only total price should be rounded.
            sellDecimalMask = Math.pow(10, pair.getSellCurrency().getDecimalPlaces());
            totalPrice = price * amountToBuy;
            totalPrice = Math.floor(totalPrice * sellDecimalMask) / sellDecimalMask;

            if (typeof this.balance[currentStrategy.buy] === 'undefined') {
                this.balance[currentStrategy.buy] = 0;
            }

            this.balance[currentStrategy.sell] -= totalPrice;
            this.balance[currentStrategy.buy] += amountToBuy;

            currentStrategy.buyAmount = amountToBuy;
            currentStrategy.sellAmount = totalPrice;
            currentStrategy.price = price;
            currentStrategy.originPair = pair.getTicker().getPairName();
            currentStrategy.tradeUrl = pair.getTicker().getTradeUrl();

            currentStrategy.fee = {
                percent: (fee * 100),
                amount: (price * fee),
                included: includeFee
            };

            if (this.debugMode) {
                this.debugLogs.push(
                    'Buying ' + amountToBuy + '[' + currentStrategy.buy + '] for ' + totalPrice + '[' + currentStrategy.sell + ']'
                );
            }
        }

        return this;
    }
}

module.exports = Calculator;