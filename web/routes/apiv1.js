const express = require('express'),
    router = express.Router();

const GraphTradeController = require('../controllers/GraphTradeController');

router.get('/pairs', (req, res, next) => {
    console.log('/pairs - open');
});

router.get('/paths', (req, res, next) => {
    console.log('/paths - open');
});

module.exports = router;