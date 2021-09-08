const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const orderMiddleware = require('../../middlewares/order');
const moment = require('moment');

router.get('/', orderMiddleware, async (req, res) => {
    // const orders = await Order.find({ status: { $ne: 'Completed' } }, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password');
    const orders = await Order.find({ status: { $ne: 'Completed' } }).sort({ createdAt: -1 }).populate('customerId', '-password');
    res.render('admin/orders', { orders: orders, moment: moment });
})

router.post('/status/:id', async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    await Order.findByIdAndUpdate(id, { status: status })
    res.redirect('/admin/orders');
})

module.exports = router;