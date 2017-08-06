const express = require('express'),
    router = express.Router();

const GraphTradeController = require('../controllers/GraphTradeController');

router.get('/pairs', (req, res, next) => {
    (new GraphTradeController(req, res)).pairsAction();
});

router.get('/paths/initial/:initial/amount/:amount', (req, res, next) => {
    (new GraphTradeController(req, res)).pathsAction(req.params.initial, req.params.amount);
});

module.exports = router;