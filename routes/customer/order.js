const express = require("express");
const router = express.Router();
const moment = require("moment");
const Order = require("../../models/order");

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let order = await Order.findById(id);
    if (req.user && req.user._id.toString() === order.customerId.toString()) {
        const address = order.address;
        const item = order.item;
        const status = order.status;
        const date = moment(order.createdAt).format("DD MMM YYYY");
        let items = [];
        for (id in item) items.push(item[id]);
        res.render("customer/order", { order: order, items: items, address: address, date: date, status: status });
    } else {
        res.redirect("/");
    }
});

module.exports = router;
