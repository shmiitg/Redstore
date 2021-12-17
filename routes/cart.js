const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('cart');
});

router.post('/increase', (req, res) => {
    let cart = req.session.cart;
    let id = req.body.item._id;
    cart.items[id].qty++;
    cart.totalQty++;
    cart.totalPrice += cart.items[id].item.price;
    res.json({
        totalQty: cart.totalQty,
        qty: cart.items[id].qty,
        price: cart.items[id].qty * cart.items[id].item.price,
        totalAmount: cart.totalPrice
    });
})

router.post('/decrease', (req, res) => {
    let cart = req.session.cart;
    let id = req.body.item._id;
    cart.items[id].qty--;
    cart.totalQty--;
    cart.totalPrice -= cart.items[id].item.price;
    if (cart.items[id].qty === 0) {
        delete cart.items[id];
        res.json({
            totalQty: cart.totalQty,
            qty: 0,
            price: 0,
            totalAmount: cart.totalPrice
        })
    } else {
        res.json({
            totalQty: cart.totalQty,
            qty: cart.items[id].qty,
            price: cart.items[id].qty * cart.items[id].item.price,
            totalAmount: cart.totalPrice
        });
    }
})

router.post('/delete', (req, res) => {
    let cart = req.session.cart;
    let id = req.body.item._id;
    cart.totalQty -= cart.items[id].qty;
    cart.totalPrice -= cart.items[id].item.price * cart.items[id].qty;
    delete cart.items[id];
    res.json({
        totalQty: cart.totalQty,
        totalAmount: cart.totalPrice
    })
})

module.exports = router;