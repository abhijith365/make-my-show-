const express = require('express')
const passport = require('passport')
const moment = require('moment')
const { ObjectId } = require('mongodb')

let User = require('../../models/User')
const Razorpay = require('razorpay');

const router = express.Router()

const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const serviceid = process.env.SERVICE_ID

const db = require('../../helper/user_helper/user_db_helper');
const { ensureAuth } = require('../../middleware/isUser')
const client = require('twilio')(accountSid, authToken);

//@desc Auth with google
//@route GET/ auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

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
                res.render('user/login_otp', { phone: req.body.phone })
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
            else {
                req.session.message = "invalid verification code"
                message = req.session.message
                req.session.message = ""
                res.render("user/login_otp", {
                    "layout": './layout/layout',
                    message,
                    phone: req.body.phone
                })
            }
        })
        .catch((error) => {
            res.render('user/login_otp.ejs', { message: "Invalid Otp" })
        });

})


// @desc creating order id
// @route POST /auth/api/payment
router.post('/api/payment',ensureAuth, async (req, res) => {
    try {
        let seat_data = req.session.order_data;
        let array = seat_data.map((e) => ObjectId(e.id))

        let seatDetail = await db.findAmt(array);
        let status = seatDetail.map((d) => d.show_seats.showByDate.shows.showSeats.seat_details.values.seat_status);

        let seat_all_not_clear = false;

        status.map(sts => { if (sts == true) { seat_all_not_clear = true } })

        let pr = 47.20;
        seatDetail.map((p) => pr += parseInt(p.show_seats.showByDate.shows.showSeats.seat_details.values.price));

        req.body.total = pr;

        if (!seat_all_not_clear) {

            var instance = new Razorpay({
                key_id: process.env.RAZ__ID,
                key_secret: process.env.RAZ_SECRET
            })

            var options = {
                amount: pr * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: `order_rcptid_11`
            };
            instance.orders.create(options, function (err, order) {

                res.render('user/home/payment.ejs', {data: req.session,total:pr,totalseat:status.length ,orderId: order.id }, function (err, html) {
                    res.send({ html, "orderId": order.id, price: pr });
                });

            });
        }
    } catch (error) {
        console.log(error)
        res.render('error/500');
    } 
})


// @desc verifying payment
// @route POST /auth/api/payment/verify
router.post("/api/payment/verify",ensureAuth, (req, res) => {
    try {
        let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

        var crypto = require("crypto");
        var expectedSignature = crypto.createHmac('sha256', process.env.RAZ_SECRET)
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", req.body.response.razorpay_signature);
        console.log("sig generated ", expectedSignature);
        var response = { "signatureIsValid": "false" }
        if (expectedSignature === req.body.response.razorpay_signature)
            response = { "signatureIsValid": "true" }
        res.send(response);
    } catch (error) {
        console.log(error)
        res.render('error/500');
    }
});


module.exports = router