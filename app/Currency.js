"use strict";

/**
 * Currency entity.
 */
class Currency {

    /**
     * @param {String} name
     *
     * @return this
     */
    setName(name) {
        this.name = name;

        return this;
    }

    /**
     * @param {Int} decimalPlaces
     */
    setDecimalPlaces(decimalPlaces) {
        this.decimalPlaces = decimalPlaces;

        return this;
    }

    /**
     * @return {[type]} [description]
     */
    getName() {
        return this.name;
    }

    /**
     * @return {Int}
     */
    getDecimalPlaces() {
        return this.decimalPlaces;
    }
}

module.exports = Currency;