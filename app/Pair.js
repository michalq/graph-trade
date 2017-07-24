"use strict";

class Pair {
    /**
     * Sets buy currency.
     *
     * @param {String} buyCurrency
     */
    setBuyCurrency(buyCurrency) {
        this.buyCurrency = buyCurrency;

        return this;
    }

    /**
     * Gets buy currency.
     *
     * @return {String}
     */
    getBuyCurrency() {
        return this.buyCurrency;
    }

    /**
     * Sets sell currency.
     *
     * @param {String} sellCurrency
     */
    setSellCurrency(sellCurrency) {
        this.sellCurrency = sellCurrency;

        return this;
    }

    /**
     * Gets sell currency.
     *
     * @return {String}
     */
    getSellCurrency() {
        return this.sellCurrency;
    }

    /**
     * Sets price.
     *
     * @param {Float} price
     */
    setPrice(price) {
        this.price = price;

        return this;
    }

    /**
     * Gets price.
     *
     * @return {Float}
     */
    getPrice() {
        return this.price;
    }

    /**
     * Sets decimal places.
     *
     * @param {Int} decimalPlaces
     */
    setDecimalPlaces(decimalPlaces) {
        this.decimalPlaces = decimalPlaces;

        return this;
    }

    /**
     * Gets decimal places.
     *
     * @return {Int}
     */
    getDecimalPlaces() {
        return this.decimalPlaces;
    }

    /**
     * Sets fee in percent.
     *
     * @param {Float} fee
     */
    setFeePercent(fee) {
        this.fee = fee;

        return this;
    }

    /**
     * Returns fee in percent.
     *
     * @return {Float}
     */
    getFeePercent() {
        return this.fee;
    }
}

module.exports = Pair;