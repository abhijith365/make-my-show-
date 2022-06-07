const express = require('express');
const route = express.Router();
const db = require('../../helper/user_helper/user_db_helper');
const { ObjectId } = require('mongodb');
const { ensureAuth, ensureGuest } = require('../../middleware/isUser')


//for showing result only for city based
route.get('/city/:id', ensureAuth, async (req, res) => {
    res.send(req.params.id)
})
route.get('/allmovies', async (req, res) => {
    try {
        let movies_ad_shows = await db.runningMovies().then(re => re).catch(err => err);
        let user = req.user || req.session.phone;
        console.log(movies_ad_shows)
        if (movies_ad_shows) {
            res.render('user/home/allMovies', {
                layout: './layout/layout.ejs',
                user,
                data: movies_ad_shows
            })
        } else throw new error;
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }

})
// for single movie page 
route.get('/movie/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id;
        let user = req.user || req.session.phone;
        let show = await db.singleShow(id).then(result => result).catch(err => err);
        console.log(show);
        if (show) {
            res.render('user/home/movie', {
                layout: './layout/layout.ejs',
                user,
                movie: show
            })
        } else
            throw new error;


    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
})
// showing movie avialble theatres
route.get('/booking/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id;
        let user = req.user || req.session.phone;
        let data = await db.runningTheatre(id).then(result => result).catch(err => err);
        if (data) {
            res.render('user/home/booking', {
                layout: './layout/layout.ejs',
                user,
                data
            })
        } else throw new error;
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
})

module.exports = route;