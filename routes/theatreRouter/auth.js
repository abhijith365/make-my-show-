const express = require('express')
const route = express.Router()
const theatreOwn = require('../../models/Theatre_own')
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const serviceid = process.env.SERVICE_ID
const { ensureAuth } = require('../../middleware/isTheater');
const db = require('../../helper/theatre_helper/database_helper')




const client = require('twilio')(accountSid, authToken);


//@desc login 
//@route POST /

route.get('/', (req, res) => {
    try {
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
    } catch (error) {
        res.render('error/500')
        console.log(error)
    }

})
//@desc login post
//@route POST /

route.post('/', async (req, res) => {
    try {
        let data = await theatreOwn.findOne({ googleMail: req.body.email, password: req.body.password }).lean()
        if (data) {
            req.session.theatreOwn = data
            res.status(200)
            res.redirect('/theatre/home');
        }
        else {
            req.session.message = "user name or password is wrong";
            res.redirect('/theatre');
        }
    } catch (error) {
        res.render('error/500')
        console.log(error.message)
    }

})


route.get('/home', async (req, res) => {
    try {
        let user = req.session.theatreOwn;
        if (!user) {
            res.redirect('/theatre')
        } else if (user.status == "Pending" || user.status == "reject") {
            res.render("theatre/status/pending", {
                "layout": './layout/layout',
                data: user
            })
        } else {
            let total = await db.TotalSell();
            res.render("theatre/index", {
                "layout": './layout/layout',
                data: user,
                admin: user,
                sell: total
            })
        }
    } catch (error) {
        res.render('error/500')
        console.log(error.message)
    }

})



//@desc view registration page
//@route GET /reg
route.get('/reg', (req, res) => {
    try {
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
    } catch (error) {
        res.render('error/500')
        console.log(error.message)
    }
})

//@desc posting register data
//@route POST /reg
route.post('/reg', async (req, res) => {
    try {
        let user = await theatreOwn.findOne({
            $or: [
                { googleMail: req.body.googleMail },
                { phone: req.body.phone }
            ]
        })
        if (!user) {
            user = await theatreOwn.create(req.body)
            console.log("user saved")
            res.redirect('/theatre')
        } else {
            req.session.message = "user alredy exit";
            res.redirect('/theatre/reg')
        }

    } catch (err) {
        res.render('error/500')
        console.log(err.message)
    }
})

//@desc posting phone number 
//@route POST /auth/phone

route.get('/auth/phone', async (req, res) => {
    try {
        res.render("theatre/authPhone", {
            "layout": './layout/layout'
        })
    } catch (error) {
        res.render('error/500')
        console.log(error.message)
    }

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
                    phone: req.body.phone
                }))
            });
    } catch (error) {
        res.render('error/500')
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

// @desc profile home page
// GET /edit/profile/:id

route.get('/edit/profile/:id', ensureAuth, (req, res) => {
    try {
        const message = req.session.message;
        req.session.message = "";
        res.render("theatre/Home/profile_form", {
            "layout": './layout/layout',
            message
        })
    } catch (error) {

    }
})



module.exports = route