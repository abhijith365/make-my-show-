const express = require('express')
const passport = require('passport')
const route = express.Router()
const theatreOwn = require('../../models/Theatre_own')
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const serviceid = process.env.SERVICE_ID





const client = require('twilio')(accountSid, authToken);



route.get('/home', (req, res) => {
    let user = req.session.theatreOwn;
    if (!user) {
        res.redirect('/theatre')
    } else {
        if (user.status == "Pending" || user.status == "reject") {
            res.render("theatre/status/pending", {
                "layout": './layout/layout',
                data: user
            })
        } else {
            res.render("theatre/index", {
                "layout": './layout/layout',
                data: user
            })
        }
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
            req.session.theatreOwner = data
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
        if (!user) {
            user = await theatreOwn.create(req.body)
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
    console.log(req.body.phone, "from auth/phone post");
    try {
        client.verify.services(serviceid)
            .verifications
            .create({ to: `+91${req.body.phone}`, channel: 'sms' })
            .then(verification => {
                res.render(res.render("theatre/login_otp", {
                    "layout": './layout/layout',
                    phone: req.body.phone
                }))
            });
    } catch (error) {
        console.error(error.message)
    }


})

// @desc otp validator 
// @route POST /auth/otp_val
route.post('/auth/otp_val', (req, res) => {
    console.log(req.body.phone, "from auth/otp_val post");
    client.verify.services(serviceid)
        .verificationChecks
        .create({ to: `+91${req.body.phone}`, code: req.body.OTP })
        .then(async (verification_check) => {
            console.log(verification_check)
            if (verification_check.status == "approved") {
                try {
                    let phone = req.body.phone
                    let user = await theatreOwn.findOne({ phone: phone })

                    if (!user) {
                        req.session.message = "user not found"
                        res.redirect('/theatre')
                        console.log("no user found")

                    }
                    else {
                        req.session.theatreOwn = user
                        res.redirect('/theatre')
                    }
                } catch (error) {
                    console.log(error.message)
                }

            } else {
                req.session.message = "invalid verification code"
                message = req.session.message
                req.session.message = ""
                res.render("theatre/login_otp", {
                    "layout": './layout/layout',
                    message,
                    phone: req.body.phone
                })
            }
        })
        .catch((error) => {
            console.log(error.message)
            res.render('theatre/login_otp.ejs', { err_msg: "Invalid Otp" })
        });

})



module.exports = route