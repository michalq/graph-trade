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
     * Returns paths.
     */
    pathsAction(currency, initial) {
        const graphTrade = new GraphTrade(currency, parseFloat(initial));

        graphTrade
        .init()
        .then(paths => {
            if (!paths.length) {
                return this.displayNotFound('No data found.');
            }

            let calculator;
            const result = [];
            for (let i = 0; i < paths.length; i++) {
                calculator = paths[i];

                try {
                    result.push({
                        logs: calculator.getDebugLogs(),
                        balance: calculator.getBalance(),
                        path: calculator.getPath().path,
                        currencies: calculator.getPath().currencies
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
            return this.displayInternalError(err.message);
        });
    }
}

module.exports = GraphTradeController;