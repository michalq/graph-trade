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
    findPaths(sellCurrency, state) {
        this.relations
            .getRelation(sellCurrency)
            .getBuyPossibilities()
            .forEach((el) => {
                if (this.initial === sellCurrency) {
                    state[el] = {
                        path: [],
                        currencies: []
                    };

                    state = state[el];
                }

                state.path.push(sellCurrency + '_' + el);
                state.currencies.push(el);

                if (this.initial === el) {
                    return;
                }

                if (state.currencies.indexOf(el)) {
                    return;
                }

                this.findPaths(el, state)
            });
        return this;
    }

    init() {
        const paths = {};
        this.findPaths(
            this.initial,
            paths
        );

        console.log('test', paths);
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