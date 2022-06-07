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
            res.render('user/index', {
                layout: './layout/layout.ejs',
                user,
                data: movies_ad_shows
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