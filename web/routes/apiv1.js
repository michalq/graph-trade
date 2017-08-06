const express = require('express'),
    router = express.Router();

const GraphTradeController = require('../controllers/GraphTradeController');

router.get('/pairs', (req, res, next) => {
    (new GraphTradeController(req, res)).pairsAction();
});

router.get('/paths', (req, res, next) => {
    (new GraphTradeController(req, res)).pathsAction();
});

module.exports = router;