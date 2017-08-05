"use strict";

const BaseController = require('./BaseController');

/**
 *
 */
class GraphTradeController extends BaseController {
    /**
     *
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
    pathsAction() {
        this.res.statusCode = 200;
        this.res.json({
            data: {}
        });
    }
}

module.exports = GraphTradeController;