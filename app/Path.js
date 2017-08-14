"use strict";

/**
 *
 */
class Path {
    constructor() {}

    /**
     * @param {Float} buyAmount
     */
    setBuyAmount(buyAmount) {
        this.buyAmount = buyAmount;
        return this;
    }

    /**
     * @param {Float} sellAmount
     */
    setSellAmount(sellAmount) {
        this.sellAmount = sellAmount;
        return this;
    }
}

module.exports = Path;