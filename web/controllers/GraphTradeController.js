"use strict";

const BaseController = require('./BaseController');
const GraphTrade = require('../../app/GraphTrade');

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
     */
    pathsAction(currency, initial, ignoreCurrencies) {
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
                        logs: calculator.getDebugLogs(),
                        balance: calculator.getBalance(),
                        path: calculator.getPath().path,
                        currencies: calculator.getPath().currencies,
                        percentRevenue: Math.floor(((calculator.getBalance()[currency] - initial) / initial) * 10000) / 100
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
        const result = {};

        this.res.statusCode = 200;
        return this.res.json({
            path: result
        });
    }
}

module.exports = GraphTradeController;