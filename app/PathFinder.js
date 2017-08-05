"use strict";

/**
 * Find possibile paths.
 */
class PathFinder {
    /**
     *
     * @param {Relations} relationsCollection
     */
    constructor(relationsCollection) {
        this.paths = [];
        this.relations = relationsCollection;
    }

    /**
     * Sets begining.
     *
     * @param {String} initial
     *
     * @return {Object} this
     */
    setInitial(initial) {
        this.initial = initial;

        return this;
    }

    /**
     * Sets destination currency.
     *
     * @param {String} destination
     *
     * @return {PathFinder} this
     */
    setDestination(destination) {
        this.destination = destination;
    }

    /**
     * Finds all possible paths.
     *
     * @return {PathFinder}
     */
    searchPath(sellCurrency, state) {
        this.relations
            .getRelation(sellCurrency)
            .getBuyPossibilities()
            .forEach((el) => {
                const newState = JSON.parse(JSON.stringify(state));
                if (-1 !== newState.currencies.indexOf(el)) {
                    return;
                }

                newState.path.push({
                    pair: sellCurrency + '_' + el,
                    sell: sellCurrency,
                    buy: el
                });

                newState.currencies.push(el);

                if (this.initial === el) {
                    this.paths.push(newState);
                    return;
                }

                this.searchPath(el, newState);
            });

        return this;
    }

    /**
     * Initialize alghorithm to look for available paths.
     *
     * @return {Bool}
     */
    init() {
        this.searchPath(
            this.initial,
            {
                path: [],
                currencies: []
            }
        );

        return this;
    }

    /**
     * Returns paths.
     *
     * @return {Array}
     */
    getPaths() {
        return this.paths;
    }
}

module.exports = PathFinder;