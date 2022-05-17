const express = require("express");
const router = express.Router();
const Order = require("../../models/order");
const orderMiddleware = require("../../middlewares/order");
const moment = require("moment");
const User = require("../../models/user");

router.get("/", orderMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
        res.render("customer/orders", { orders: orders, moment: moment });
    } catch (err) {
        res.redirect("/");
    }
});

router.post("/", async (req, res) => {
    const { phone, address } = req.body;
    if (!phone || !address) {
        req.flash("error", "All fields are required");
        return res.redirect("/cart");
    }
    const order = new Order({
        customerId: req.user._id,
        item: req.session.cart.items,
        phone: phone,
        address: address,
    });
    try {
        const user = await User.findById(req.user._id);
        await order.save();
        const result = {
            order,
            name: user.name,
            time: moment(order.createdAt).format("hh:mm A"),
            date: moment(order.createdAt).format("DD MMM YYYY"),
        };
        req.flash("success", "Order placed successfully");
        delete req.session.cart;
        // Emit event
        const eventEmitter = req.app.get("eventEmitter");
        eventEmitter.emit("orderPlaced", result);
        res.redirect("/customer/orders");
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong");
        res.redirect("/cart");
    }
});

module.exports = router;
