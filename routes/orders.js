const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const orderMiddleware = require('../middlewares/order');
const moment = require('moment');
const order = require('../models/order');


router.post('/', (req, res) => {
    const { phone, address } = req.body;
    if (!phone || !address) {
        req.flash('error', 'All fields are required');
        res.redirect('/cart');
    }
    else {
        const order = new Order({
            customerId: req.user._id,
            item: req.session.cart.items,
            phone: phone,
            address: address
        });
        order.save()
            .then(() => {
                req.flash('success', 'Order placed successfully');
                delete req.session.cart;
                res.redirect('/orders');
            })
            .catch(() => {
                req.flash('error', 'Something went wrong');
                res.redirect('/cart');
            });
    }
})

router.get('/', orderMiddleware, async (req, res) => {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    res.render('orders', { orders: orders, moment: moment });
})

module.exports = router;