const express = require('express')
const passport = require('passport')
const router = express.Router()
let User = require('../../models/User')

const accountSid = "ACf9f3bcac16a5c5b52ab07d450ed29429"
const authToken = "2b03743be2a5f1f0889bc00e2f6ccbec"
const serviceid = "VA49d520444271358c475888bba93f31d0"


const client = require('twilio')(accountSid, authToken);

//@desc Auth with google
//@route GET/ auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@desc  google auth callback
//@route GET /auth/google/callback

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/')
    })

//@desc   auth logout
//@route GET /auth/logout
router.get('/logout', (req, res) => {
    req.session.destroy()
    req.logOut()
    res.redirect('/')
})

//@desc otp sender
//@route POST /auth/login

router.post('/login', (req, res) => {
    try {
        client.verify.services(serviceid)
            .verifications
            .create({ to: `+91${req.body.phone}`, channel: 'sms' })
            .then(verification => {
                res.render('user/login_otp', { phonenum: req.body.phone })
            });
    } catch (error) {
        console.error(error.message)
    }


})

// @desc otp validator 
// @route POST /auth/otp_val
router.post('/otp_val', (req, res) => {
    client.verify.services(serviceid)
        .verificationChecks
        .create({ to: `+91${req.body.phone}`, code: req.body.OTP })
        .then(async (verification_check) => {
            if (verification_check.status == "approved") {
                try {
                    let phone = req.body.phone
                    let user = await User.findOne({ phone: phone })

                    if (user) {
                        req.session.phone = user
                        res.redirect('/')
                    }
                    else {
                        user = await User.create({ phone: req.body.phone });
                        req.session.phone = user
                        res.redirect('/')
                    }
                } catch (error) {
                    console.log(error.message)
                }

            }
        })
        .catch((error) => {
            res.render('user/login_otp.ejs', { err_msg: "Invalid Otp" })
        });

})


module.exports = router