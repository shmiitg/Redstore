const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const User = require('../models/user');

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        //Match email
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'Email not registered' });
        }
        //Match password
        bcrypt.compare(password, user.password)
            .then(match => {
                if (match) return done(null, user, { message: 'Logged in successfully' });
                else return done(null, false, { message: 'Wrong username or password' });
            }).catch(() => { return done(null, false, { message: 'Something went wrong' }) });
    }));

    //Serialize user
    passport.serializeUser((user, done) => done(null, user._id));
    //deserealize user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
}

module.exports = init;