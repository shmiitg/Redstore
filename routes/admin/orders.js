const express = require("express");
const router = express.Router();
const Order = require("../../models/order");
const admin = require("../../middlewares/admin");
const moment = require("moment");

router.get("/", admin, async (req, res) => {
    try {
        const orders = await Order.find({ status: { $ne: "Completed" } })
            .sort({ createdAt: -1 })
            .populate("customerId", "-password");
        res.render("admin/orders", { orders: orders, moment: moment });
    } catch (err) {
        res.redirect("/");
    }
});

router.post("/status/:id", async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    await Order.findByIdAndUpdate(id, { status: status });
    const eventEmitter = req.app.get("eventEmitter");
    eventEmitter.emit("orderUpdated", { id: id, status: req.body.status });
    res.redirect("/admin/orders");
});

module.exports = router;
