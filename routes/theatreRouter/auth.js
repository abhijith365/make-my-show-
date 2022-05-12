const express = require('express')
const passport = require('passport')
const route = express.Router()
const theatreOwn = require('../../models/Theatre_own')
const accountSid = "ACf9f3bcac16a5c5b52ab07d450ed29429"
const authToken = "2b03743be2a5f1f0889bc00e2f6ccbec"
const serviceid = "VA49d520444271358c475888bba93f31d0"


const client = require('twilio')(accountSid, authToken);



route.get('/home', (req, res) => {
    if (!req.session.theatreOwn) {
        res.redirect('/theatre/')
    } else {
        let status = req.session.theatreOwnstatus;
        console.log(status)
        res.render("theatre/index", {
            "layout": './layout/layout',
            status
        })
    }
})


route.get('/', (req, res) => {
    if (req.session.theatreOwn) {
        res.redirect('/theatre/home')
    } else {
        const message = req.session.message;
        req.session.message = "";
        res.render("theatre/login", {
            "layout": './layout/layout',
            message
        })
    }
})
//@desc login post
//@route POST /

route.post('/', async (req, res) => {
    console.log(req.body)
    try {
        let data = await theatreOwn.findOne({ googleMail: req.body.email, password: req.body.password })
        console.log(data)
        if (data) {
            req.session.theatreOwn = req.body.email
            req.session.theatreOwnstatus = data.status
            res.status(200)
            res.redirect('/theatre/home');
        }
        else {
            req.session.message = "user name or password is wrong";
            res.redirect('/theatre');
        }
    } catch (error) {
        console.log(error.message)
    }

})

//@desc view registration page
//@route GET /reg
route.get('/reg', (req, res) => {
    if (req.session.theatreOwn) {
        res.redirect('/theatre/home')
    } else {
        const message = req.session.message;
        req.session.message = "";
        res.render("theatre/reg", {
            "layout": './layout/layout',
            message
        })
    }
})

//@desc posting register data
//@route POST /reg
route.post('/reg', async (req, res) => {
    try {
        let user = await theatreOwn.findOne({ googleMail: req.body.googleMail })
        console.log(user)
        if (!user) {
            user = await theatreOwn.create(req.body)
            console.log(user)
            console.log("user saved")
            res.redirect('/theatre')
        } else {
            req.session.message = "user alredy exit";
            res.redirect('/theatre/reg')
        }

    } catch (err) {
        console.log(err.message)
    }
})

//@desc posting phone number 
//@route POST /auth/phone

route.get('/auth/phone', async (req, res) => {
    res.render("theatre/authPhone", {
        "layout": './layout/layout'
    })
})


//@desc otp sender
//@route POST /auth/login

route.post('/auth/phone', (req, res) => {
    try {
        client.verify.services(serviceid)
            .verifications
            .create({ to: `+91${req.body.phone}`, channel: 'sms' })
            .then(verification => {
                res.render(res.render("theatre/login_otp", {
                    "layout": './layout/layout',
                    phonenum: req.body.phone
                }))
            });
    } catch (error) {
        console.error(error.message)
    }


})

// @desc otp validator 
// @route POST /auth/otp_val
route.post('/auth/otp_val', (req, res) => {
    client.verify.services(serviceid)
        .verificationChecks
        .create({ to: `+91${req.body.phone}`, code: req.body.OTP })
        .then(async (verification_check) => {
            if (verification_check.status == "approved") {
                try {
                    let phone = req.body.phone
                    let user = theatreOwn.findOne({ phone: phone })

                    if (user) {
                        req.session.phone = user
                        res.redirect('/theater')
                    }
                    else {
                        res.redirect('/theater')
                    }
                } catch (error) {
                    console.log(error.message)
                }

            }
        })
        .catch((error) => {
            console.log(error.message)
            res.render('user/login_otp.ejs', { err_msg: "Invalid Otp" })
        });

})



module.exports = route