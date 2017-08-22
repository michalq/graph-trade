"use strict";

const BaseController = require('./BaseController');
const GraphTrade = require('../../app/GraphTrade');
const GraphTradeHelper = require('../../app/GraphTradeHelper');
const PairsHelper = require('../../app/PairsHelper');

/**
 * Class to manage graph trade loop.
 */
class GraphTradeController extends BaseController {
    /**
     * Returns available paths.
     */
    pairsAction() {
        this.res.statusCode = 200;
        this.res.json({
            data: {}
        });
    }

    /**
     * Returns all possible paths for given currency and initial value.
     *
     * @param {String} currency
     * @param {Number} initial
     * @param {String} ignoreCurrencies
     * @param {Bool} includeFee
     */
    pathsAction(currency, initial, ignoreCurrencies, includeFee) {
        initial = parseFloat(initial);

        const graphTrade = new GraphTrade(currency, initial);
        let ignoreCurr = [];
        if (typeof ignoreCurrencies !== 'undefined' && ignoreCurrencies.length) {
            ignoreCurr = ignoreCurrencies.split(',');
        }

        graphTrade
        .init()
        .then(paths => {
            if (!paths.length) {
                return this.displayNotFound('No data found.');
            }

            let calculator, currencies;
            const result = [];

            main:
            for (let i = 0; i < paths.length; i++) {
                calculator = paths[i];
                currencies = calculator.getPath().currencies;

                for (let j = 0; j < ignoreCurr.length; j++) {
                    if (-1 !== currencies.indexOf(ignoreCurr[j])) {
                        continue main;
                    }
                }

                try {
                    result.push({
                        guid: calculator.getPathGuid(),
                        logs: calculator.getDebugLogs(),
                        balance: calculator.getBalance(),
                        path: calculator.getPath().path,
                        currencies: calculator.getPath().currencies,
                        percentRevenue: calculator.getPercentRevenue()
                    });
                } catch (e) {
                    return this.displayInternalError(e.message);
                }
            }

            this.res.statusCode = 200;
            return this.res.json({
                paths: result,
                errorLogs: []
            });
        })
        .catch(err => {
            console.log(err);
            return this.displayInternalError(err.message);
        });
    }

    /**
     * Returns prices, revenue for given path.
     */
    pathAction() {
        const initialCurrency = 'ltc',
            initialAmount = 1,
            body = this.req.body;

        let path;
        try {
            path = this.processInput(body);
        } catch (e) {
            return this.displayBadRequest(e.message);
        }

        GraphTradeHelper.fetchData().then(data => {
            const pairsHelper = new PairsHelper(data[0], data[1]);
            pairsHelper.findPairs();

            let calculator;
            try {
                calculator = GraphTradeHelper.calculatePath(
                    pairsHelper.getPairs(),
                    initialCurrency,
                    initialAmount,
                    path
                );

                return this.displayOk({
                    data: {
                        guid: calculator.getPathGuid(),
                        balance: calculator.getBalance(),
                        path: calculator.getPath().path,
                        currencies: calculator.getPath().currencies,
                        percentRevenue: calculator.getPercentRevenue()
                    }
                });
            } catch(e) {
                console.log(e);
                return this.displayInternalError(e.message);
            }
        }).catch(e => {
            return this.displayInternalError(e.message);
        });
    }

    /**
     * Checks if user provide proper input.
     *
     * @param {Object} body
     *
     * @return {Bool}
     */
    processInput(body) {
        if (typeof body.path === 'undefined') {
            throw new Error('Wrong input. Missing data.');
        }

        body.currencies = [];
        for (let i = 0; i < body.path.length; i++) {
            if (typeof body.path[i].buy === 'undefined') {
                throw new Error('Not found buy currency in step ' + i);
            }

            if (typeof body.path[i].sell === 'undefined') {
                throw new Error('Not found sell currency in step ' + i);
            }

            if (-1 === body.currencies.indexOf(body.path[i].buy)) {
                body.currencies.push(body.path[i].buy);
            }
        }

        return body;
    }
}

module.exports = GraphTradeController;