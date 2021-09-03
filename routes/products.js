const express = require('express');
const router = express.Router();
const Stocks = require('../models/stock');

router.get('/', async (req, res) => {
    try {
        const stocks = await Stocks.find({});
        res.render('products', { stocks: stocks })
    }
    catch {
        res.redirect('/');
    }
})

//cart structure to be stored in session
// let cart = {
//     "cart": {
//         "items": {
//             "611a4b4b89862949553c200f": {
//                 "item": { "_id": "611a4b4b89862949553c200f", "name": "Jeans", "image": "product-3.jpg", "price": 60 },
//                 "qty": 1
//             },
//             "611a4b0b89862949553c200e": {
//                 "item": { "_id": "611a4b0b89862949553c200e", "name": "Shoes", "image": "product-2.jpg", "price": 75 },
//                 "qty": 1
//             }
//         },
//         "totalQty": 2,
//         "totalPrice": 135
//     }
// }

router.post('/update', (req, res) => {
    //create cart object in session
    if (!req.session.cart) {
        req.session.cart = { items: {}, totalQty: 0, totalPrice: 0 }
    }

    let cart = req.session.cart;
    let id = req.body._id;
    //create new object if it is not present
    if (!cart.items[id]) {
        cart.items[id] = { item: req.body, qty: 1 }
    }
    else {
        cart.items[id].qty++;
    }
    cart.totalQty++;
    cart.totalPrice += req.body.price;

    res.json({ totalQty: cart.totalQty });
})

module.exports = router;