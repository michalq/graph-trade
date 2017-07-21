
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
}

module.exports = Pairs;