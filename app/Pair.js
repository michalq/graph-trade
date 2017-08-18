"use strict";

class Pair {
    /**
     * @param {Ticker} ticker
     */
    setTicker(ticker) {
        this.ticker = ticker;

        return this;
    }

    /**
     * @return {Ticker}
     */
    getTicker() {
        return this.ticker;
    }

    /**
     * @param {Currency} buyCurrency
     *
     * @return this
     */
    setBuyCurrency(buyCurrency) {
        this.buyCurrencyEntity = buyCurrency;

        return this;
    }

    /**
     * @return {Currency}
     */
    getBuyCurrency() {
        return this.buyCurrencyEntity;
    }

    /**
     * @param {Currency} sellCurrency
     *
     * @return this
     */
    setSellCurrency(sellCurrency) {
        this.sellCurrencyEntity = sellCurrency;

        return this;
    }

    /**
     * @return {Currency}
     */
    getSellCurrency() {
        return this.sellCurrencyEntity;
    }

    /**
     * Returns human readable name for pair.
     *
     * @return {String}
     */
    getName() {
        return this.getBuyCurrency().getName() + '_' + this.getSellCurrency().getName();
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