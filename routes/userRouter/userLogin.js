const express = require('express');
const route = express.Router();
const db = require('../../helper/user_helper/user_db_helper');
const { ensureAuth, ensureGuest } = require('../../middleware/isUser')


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
        console.error(error)

    }

})

route.get('/login', (req, res) => {
    res.render('user/login', {
        layout: './layout/layout.ejs'
    })
})

//@desc user profile page
//@route GET /profile
route.get('/profile', ensureAuth, (req, res) => {
    let user = req.user || req.session.phone;
    res.render('user/profile', {
        layout: './layout/layout.ejs',
        user
    }
    )
})


module.exports = route