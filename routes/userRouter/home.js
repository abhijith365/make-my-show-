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
route.get('/movie/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let show = "";
    } catch (error) {

    }
})


module.exports = route;