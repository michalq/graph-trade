"use strict";

/**
 * Class represents pairs collection.
 */
class Pairs {
    constructor() {
        this.pairs = {};
    }

    /**
     * @param {Pair} pair
     */
    addPair(pair) {
        this.pairs[pair.getBuyCurrency() + "_" + pair.getSellCurrency()] = pair;
        return this;
    }

    getPair(pair) {
        return this.pairs[pair];
    }
}

module.exports = Pairs;