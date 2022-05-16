module.exports = {

    ensureAuth: function (req, res, next) {
        if (req.session.theatreOwn) {
            return next()
        } else {
            res.redirect('/theatre')
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/')
        } else {
            return next()
        }
    }
}
