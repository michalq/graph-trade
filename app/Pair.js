"use strict";

class Pair {
    /**
     * @param {Currency} buyCurrency
     *
     * @return this
     */
    setBuyCurrencyEntity(buyCurrency) {
        this.buyCurrencyEntity = buyCurrency;

        return this;
    }

    /**
     * @return {Currency}
     */
    getBuyCurrencyEntity() {
        return this.buyCurrencyEntity;
    }

    /**
     * @param {Currency} sellCurrency
     *
     * @return this
     */
    setSellCurrencyEntity(sellCurrency) {
        this.sellCurrencyEntity = sellCurrency;

        return this;
    }

    /**
     * @return {Currency}
     */
    getSellCurrencyEntity() {
        return this.sellCurrencyEntity;
    }

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
     * Returns human readable name for pair.
     *
     * @return {String}
     */
    getName() {
        return this.buyCurrency + '_' + this.sellCurrency;
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