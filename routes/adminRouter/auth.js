const express = require('express');
const Admin = require('../../models/Admin')
const { ensureAuth } = require('../../middleware/isAdmin')
const route = express.Router();
const theatreOwn = require('../../models/Theatre_own');

//admin  login 

route.get('/', (req, res) => {
    if (req.session.adminName) {
        res.redirect('/admin/adminHome')
    } else {
        const message = req.session.message;
        req.session.message = "";
        res.render('admin/login', {
            layout: './layout/layout.ejs',
            message: message, "name": req.session.adminName
        });
    }

})

route.post('/', async (req, res) => {
    console.log(req.body)
    try {
        let data = await Admin.findOne({ email: req.body.email, password: req.body.password })

        if (data) {
            req.session.adminName = req.body.email;
            res.status(200)
            res.redirect('/admin/adminHome');
        }
        else {
            req.session.message = "user name or password is wrong";
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message)
    }

})
//@desc   logout
//@route GET admin/auth/logout
route.get('/auth/logout', (req, res) => {
    req.session.destroy()
    req.logOut()
    res.redirect('/')
})

// @desc admin home
// @route GET /adminHome

route.get('/adminHome', (req, res) => {
    if (!req.session.adminName) {
        res.redirect('/admin')
    } else {
        res.render('admin/index', {
            layout: './layout/layout.ejs'
        });
    }
})

route.get('/adminHome/status', ensureAuth, async (req, res) => {
    try {
        let data = await theatreOwn.find({ status: "Pending" }).lean()
        res.render('admin/status', {
            layout: './layout/layout.ejs',
            data
        });
    } catch (err) {
        console.log(err.message)
    }

})

// @desc admin status reject
// @route GET /status/reject/:id

route.get('/status/reject/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id
        await theatreOwn.findByIdAndUpdate({ _id: id }, { status: "reject" })
        console.log("rejected")
        res.redirect('/admin/adminHome/status')
    } catch (error) {
        console.log(error.message)
    }
})
route.get('/status/accept/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id
        await theatreOwn.findByIdAndUpdate({ _id: id }, { status: "accept" })
        console.log("accept")
        res.redirect('/admin/adminHome/status')
    } catch (error) {
        console.log(error.message)
    }
})


module.exports = route