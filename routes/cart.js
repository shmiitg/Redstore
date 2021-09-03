const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('cart');
});

router.get('/increase/:id', (req, res) => {
    let cart = req.session.cart;
    let id = req.params.id;
    cart.items[id].qty++;
    cart.totalQty++;
    cart.totalPrice += cart.items[id].item.price;
    res.redirect('/cart');
})

router.get('/decrease/:id', (req, res) => {
    let cart = req.session.cart;
    let id = req.params.id;
    cart.items[id].qty--;
    cart.totalQty--;
    cart.totalPrice -= cart.items[id].item.price;
    if (cart.items[id].qty === 0) {
        delete cart.items[id];
    }
    res.redirect('/cart');
})

router.get('/delete/:id', (req, res) => {
    let cart = req.session.cart;
    let id = req.params.id;
    cart.totalQty -= cart.items[id].qty;
    cart.totalPrice -= cart.items[id].item.price * cart.items[id].qty;
    delete cart.items[id];
    req.session.cart = cart;
    res.redirect('/cart');
})

module.exports = router;