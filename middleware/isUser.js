module.exports = {

    ensureAuth: function (req, res, next) {
        if (req.user || req.session.phone) {
            return next()
        } else {
            res.redirect('/login')
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