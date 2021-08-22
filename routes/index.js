const express = require('express');
const router = express.Router();
const Stocks = require('../models/stock');

router.get('/', async (req, res) => {
    try {
        const stocks = await Stocks.find({});
        res.render('index', { stocks: stocks })
    }
    catch {
        res.redirect('/');
    }
});

module.exports = router;