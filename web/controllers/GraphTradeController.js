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
        const result = {},
            initialCurrency = 'ltc',
            initialAmount = 1,
            path = [];

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

                this.res.statusCode = 200;
                return this.res.json({
                    path: calculator
                });
            } catch(e) {
                console.log(e);
                return this.displayInternalError(e.message);
            }
        });
    }
}

module.exports = GraphTradeController;