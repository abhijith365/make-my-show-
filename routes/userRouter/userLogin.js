const express = require('express');
const { ObjectId } = require('mongodb');
const route = express.Router();
const db = require('../../helper/user_helper/user_db_helper');
const { ensureAuth, ensureGuest } = require('../../middleware/isUser')
const moment = require('moment')
const Swal = require('sweetalert2')


//@desc user home page
//@route GET /

route.get('/', async (req, res) => {
    try {
        let user = req.user || req.session.phone;
        let movies_ad_shows = await db.runningMovies().then(re => re).catch(err => err);
        let upcomingMovies = await db.upcomingMovies().then(re => re).catch(err => err);

        if (upcomingMovies) {
            // filtering data removing duplicate data
            let uniqueArray = movies_ad_shows.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.movies[0].movie_uid === value.movies[0].movie_uid
                ))
            )
            if (user) {


                res.render('user/index', {
                    layout: './layout/layout.ejs',
                    user,
                    data: uniqueArray,
                    upcoming: upcomingMovies
                })
            } else {
                res.render('user/index', {
                    layout: './layout/layout.ejs',
                    user: "",
                    data: uniqueArray,
                    upcoming: upcomingMovies
                })
            }
        } else throw new error

    } catch (error) {
        res.render('error/500')
        console.error(error)

    }

})

route.get('/login', (req, res) => {
    try {
        res.render('user/login', {
            layout: './layout/layout.ejs'
        })
    } catch (error) {
        res.render('error/500')
        console.error(error)
    }

})

//@desc user profile page
//@route GET /profile
route.get('/profile', ensureAuth, (req, res) => {
    try {
        let user = req.user || req.session.phone;
        res.render('user/profile', {
            layout: './layout/layout.ejs',
            user
        })
    } catch (error) {
        res.render('error/500')
        console.error(error)
    }

})

//@desc user edit profile page
//@route GET /edit_profile
route.get('/edit_profile', ensureAuth, async (req, res) => {
    try {
        let user = req.user || req.session.phone;
        res.render('user/edit_profile', {
            layout: './layout/layout.ejs',
            user
        })
    } catch (error) {
        res.render('error/500')
        console.error(error)
    }

})

//@desc user ticket home page
//@route GET /tickets
route.get("/tickets", ensureAuth, async (req, res) => {
    try {
        let user = req.user || req.session.phone;
        let id = user._id;
        if (typeof (id) == "string") { id = ObjectId(user._id) }

        let ticketData = await db.TicketLookup(id);

        if (ticketData) {
            res.render('user/home/ticketHome', {
                layout: './layout/layout.ejs',
                user,
                data: ticketData,
                moment,
                Swal
            })
        } else throw new error;

    } catch (error) {
        res.render('error/500')
        console.error(error)
    }

})

//@desc user cancel_ticket
//@route POST /cancel_tickets
route.post('/cancelTicket', ensureAuth, async (req, res) => {
    try {
        console.log(req.body)
        res.send(req.id)
        // let id = ObjectId(req.id);
    } catch (error) {
        res.render('error/500')
        console.error(error)
    }
})




module.exports = route