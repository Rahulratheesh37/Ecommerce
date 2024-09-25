
// middleware/auth.js
function isAuthenticated(req, res, next) {
    if (req.session.isAuth) {
        next();
    } else {
        req.session.prepage=req.url;
        res.redirect('/login');
    }
}

   module.exports = isAuthenticated;
