const express = require('express'),
    router = express.Router();

const GraphTradeController = require('../controllers/GraphTradeController');

router.get('/pairs', (req, res, next) => {
    (new GraphTradeController(req, res)).pairsAction();
});

router.get('/paths/initial/:initial/amount/:amount', (req, res, next) => {
    (new GraphTradeController(req, res)).pathsAction(
        req.params.initial,
        parseFloat(req.params.amount)
    );
});

router.get('/paths/initial/:initial/amount/:amount/ignore/:ignoreCurrencies', (req, res, next) => {
    (new GraphTradeController(req, res)).pathsAction(
        req.params.initial,
        parseFloat(req.params.amount),
        req.params.ignoreCurrencies
    );
});

router.get('/paths/initial/:initial/amount/:amount/ignore/:ignoreCurrencies/fee/:includeFee', (req, res, next) => {
    (new GraphTradeController(req, res)).pathsAction(
        req.params.initial,
        parseFloat(req.params.amount),
        req.params.ignoreCurrencies,
        parseInt(req.params.includeFee) ? true : false
    );
});

router.post('/path', (req, res, next) => {
    (new GraphTradeController(req, res)).pathAction();
});

module.exports = router;