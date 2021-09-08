const express = require('express');
const router = express.Router();
const moment = require('moment');
const Order = require('../../models/order');

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let order = await Order.findById(id);
    const address = order.address;
    const item = order.item;
    const date = moment(order.createdAt).format(' DD-MMM YYYY');
    let items = [];
    for (itemId in item) items.push(item[itemId]);
    res.render('customer/order', { items: items, address: address, date: date });
})

module.exports = router;