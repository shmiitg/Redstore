const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/user');
const passport = require('passport');
const userMiddleware = require('../middlewares/user');

// Login Page
router.get('/login', userMiddleware, (req, res) => res.render('account/login'));

// Handle Login
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        req.flash('error', 'All field are required');
        res.redirect('/account/login');
    }
    else {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/account/login',
            failureFlash: true
        })(req, res, next);
    }
});


// Register Page
router.get('/register', userMiddleware, (req, res) => res.render('account/register'));

// Handle Register
router.post('/register', async (req, res) => {
    const { name, email, password, cpassword } = req.body;
    let error = 'none';

    //validate form
    if (!name || !email || !password || !cpassword) {
        error = 'All fields are required';
    }
    else if (password !== cpassword) {
        error = 'Passwords do not match';
    }
    else if (password.length < 6) {
        error = 'Password should be atleast 6 characters';
    }
    if (error !== 'none') {
        req.flash('error', error);
        req.flash('name', name);
        req.flash('email', email);
        res.redirect('/account/register');
    }
    // Hash password
    else {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({ name: name, email: email, password: hashedPassword });
        user.save()
            .then(() => {
                req.flash('success', 'Your are now registered');
                res.redirect('/');
            })
            .catch(() => {
                req.flash('error', 'Email already taken');
                req.flash('name', name);
                req.flash('email', email);
                res.redirect('/account/register');
            });
    }
});

// Handle logout
router.post('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'You are logged out');
    res.redirect('/account/login');
});

module.exports = router;