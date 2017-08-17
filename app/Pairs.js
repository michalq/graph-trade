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
        this.pairs[pair.getBuyCurrency().getName() + "_" + pair.getSellCurrency().getName()] = pair;
        return this;
    }

    getPair(pair) {
        if (typeof this.pairs[pair] === 'undefined') {
            throw new Error('Pair ' + pair + ' not found.');
        }

        return this.pairs[pair];
    }
}

module.exports = Pairs;