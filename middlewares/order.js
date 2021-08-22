function init(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login to view that resource');
    return res.redirect('/account/login');
}

module.exports = init;

