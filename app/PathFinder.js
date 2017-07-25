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
    setDestication(destination) {
        this.destination = destination;
    }

    /**
     * Finds all possible paths.
     *
     * @return {PathFinder}
     */
    findPaths(sellCurrency, state) {
        this.relations
            .getRelation(sellCurrency)
            .getBuyPossibilities()[state.buyCurrentIndex]
            .forEach((el) => {
                state.currentIndex++;
                this.findPaths(el, state)
            });
        return this;
    }

    init() {
        this.findPaths(
            this.initial,
            {
                currentIndex: 0,
                path: []
            }
        );
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