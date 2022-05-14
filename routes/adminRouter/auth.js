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
// @desc admin status 
// @route GET /status/

route.get('/adminHome/status', ensureAuth, async (req, res) => {
    try {
        let pending_data = await theatreOwn.find({ status: "Pending" }).lean()
        res.render('admin/status', {
            layout: './layout/layout.ejs',
            data: pending_data,
            status: "Pending"
        });
    } catch (err) {
        console.log(err.message)
    }

})
// @desc admin status 
// @route GET /status/accept

route.get('/status/accept', ensureAuth, async (req, res) => {
    try {

        let accept_data = await theatreOwn.find({ status: "accept" }).lean()
        res.render('admin/status', {
            layout: './layout/layout.ejs',
            data: accept_data,
            status: "Accept"
        });
    } catch (err) {
        console.log(err.message)
    }

})
// @desc admin status 
// @route GET /status/reject

route.get('/status/reject', ensureAuth, async (req, res) => {
    try {
        let reject_data = await theatreOwn.find({ status: "reject" }).lean()
        res.render('admin/status', {
            layout: './layout/layout.ejs',
            data: reject_data,
            status: "Reject"
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
        res.redirect('/admin/adminHome/status')
    } catch (error) {
        console.log(error.message)
    }
})
// @desc admin status accept
// @route GET /status/accept/:id
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