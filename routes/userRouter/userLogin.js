const express = require('express');
const route = express.Router();
const db = require('../../helper/user_helper/user_db_helper');


//@desc user home page
//@route GET /

route.get('/', async (req, res) => {
    try {
        let user = req.user || req.session.phone;
        let movies_ad_shows = await db.runningMovies().then(re => re).catch(err => err);

        if (user) {
            // filtering data removing duplicate data
            let uniqueArray = movies_ad_shows.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.movies[0].movie_uid === value.movies[0].movie_uid
                ))
            )

            res.render('user/index', {
                layout: './layout/layout.ejs',
                user,
                data: uniqueArray
            })
        } else {
            res.render('user/index', {
                layout: './layout/layout.ejs',
                user: "",
                data: movies_ad_shows
            })
        }

    } catch (error) {
        console.error(error)

    }

})

route.get('/login', (req, res) => {
    res.render('user/login', {
        layout: './layout/layout.ejs'
    })
})


module.exports = route