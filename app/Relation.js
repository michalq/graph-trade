/**
 * Relation keeps owning currency
 */
class Relation {
    constructor(owningCurrency) {
        this.owningCurrency = owningCurrency;
        this.buyPossibilities = [];
    }

    /**
     * Returns owning currency.
     *
     * @return {String}
     */
    getOwningCurrency() {
        return this.owningCurrency;
    }

    /**
     * Returns currencies that can be bought using owning currency.
     *
     * @return {Array}
     */
    getBuyPossibilities() {
        return this.buyPossibilities;
    }

    /**
     * Adds new buy currency.
     *
     * @param  {String} buyCurrency
     * @return {Object} this
     */
    push(buyCurrency) {
        this.buyPossibilities.push(buyCurrency);

        return this;
    }
}

module.exports = Relation;