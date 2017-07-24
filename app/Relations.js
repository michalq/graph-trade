const Relation = require('./Relation');

/**
 * Class saves all relations among pairs.
 */
class Relations {
    constructor(relationCollection) {
        this.relations = {};
    }

    /**
     * Get relation of sell currency.
     *
     * @param {String} sellCurrency
     *
     * @return {Relation}
     */
    getRelation(sellCurrency) {
        return this.relations[sellCurrency];
    }

    /**
     * Add new relation.
     *
     * @param {String} buyCurrency
     * @param {String} sellCurrency
     *
     * @return {Relations}
     */
    addRelation(buyCurrency, sellCurrency) {
        if (typeof this.relations[sellCurrency] === 'undefined') {
            this.relations[sellCurrency] = new Relation(sellCurrency);
        }

        this.relations[sellCurrency].push(buyCurrency);

        return this;
    }
}

module.exports = Relations;