const express = require('express');
const router = express.Router();
const Order = require('../../models/order');

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let order = await Order.findById(id);
    order = order.item
    let items = [];
    for (itemId in order) items.push(order[itemId]);
    // console.log(items.length);
    res.render('order', { items: items });
})

module.exports = router;

// var JS_Obj =
//     '{"prop_1":"val_1", "prop_2":"val_2", "prop_3" : "val_3"}';

// console.log(JSON.parse(JS_Obj));