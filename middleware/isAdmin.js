module.exports = {

    ensureAuth: function (req, res, next) {
        if (req.session.adminName) {
            return next()
        } else {
            res.redirect('/admin')
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
