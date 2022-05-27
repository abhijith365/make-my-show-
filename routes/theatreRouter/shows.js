const express = require('express')
const route = express.Router();
const db = require('../../helper/theatre_helper/database_helper')
const { ensureAuth } = require('../../middleware/isTheater')
const fs = require('fs')

// multer for image uploads
const multer = require('multer')
const database_helper = require('../../helper/theatre_helper/database_helper')
const { session } = require('passport');
const { error } = require('console');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const upload = multer({ storage: storage })

// add shows page
route.get('/', ensureAuth, async (req, res) => {
    try {
        let theatreOwn = req.session.theatreOwn._id;
        let movies = await db.showMovies(theatreOwn).then(e => e).catch(e => e);
        let hall = await db.showAllScreen(theatreOwn).then(e => e).catch(e => e);
        // const cinemaScreen = await database_helper.showCinema_screen(TheatreOwn).then(res => res).catch(e => e);

        if (movies && hall) {
            message = req.session.message;
            req.session.message = "";
            res.render('theatre/Home/add_show', {
                "layout": "./layout/layout.ejs",
                movies, hall, theatreOwn, message
            })
        } else throw new error;

    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})
// add shows post request
route.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.createdAt = Date.now();
        req.body.theatreOwn = req.session.theatreOwn._id;

        let show = await db.AddShow(req.body).then(res => res).catch(e => e);

        if (show) {
            res.redirect(`/theatre/home`)
        }
        else {
            req.session.message = "show id exits"
            res.redirect(`/theatre/shows/`)
        }
    } catch (err) {
        res.render('error/500')
        console.log(err);
    }
})
// shows home
route.get('/home', ensureAuth, async (req, res) => {
    try {
        let obj = req.session.theatreOwn._id;
        let allShows = await db.AllShows(obj).then(e => e).catch(e => e);
        let screen_id = allShows[0].screen_id;
        let all = await db.showCinema_screen(screen_id).then(e => e).catch(e => e)


        res.render('theatre/Home/show', {
            "layout": "./layout/layout.ejs", arr: all
        })
    } catch (error) {
        res.render('error/500')
        console.log(error);
    }
})
// food home page
route.get('/food/:id', ensureAuth, async (req, res) => {
    try {

        let obj = req.params.id;
        let allShows = await db.AllFoods(obj).then(e => e).catch(e => e);


        res.render('theatre/Home/food_home', {
            "layout": "./layout/layout.ejs", arr: allShows,
            theatreId: obj
        })

    } catch (error) {
        res.render('error/500')
        console.log(error);
    }
})
// add food post request
route.post('/food/:id', ensureAuth, upload.single('image'), async (req, res) => {
    try {
        let id = req.params.id;
        let file = req.file;

        image = { image_url: file.filename }

        req.body.theatreId = id;
        req.body.image = image;
        req.body.theatreOwn = req.session.theatreOwn._id;
        req.body.createdAt = Date.now();

        let data = await db.AddFood(req.body).then(res => res).catch(err => err);
        if (data) {
            res.redirect(`/theatre/shows/food/${id}`)
        }
        else {
            req.session.message = "food id is already exits"
            res.redirect(`/theatre/shows/add/food/${id}`)
        }

    } catch (error) {
        res.render('error/500')
        console.log(error);
    }
})
// add food 
route.get('/add/food/:id', ensureAuth, (req, res) => {
    try {
        let message = req.session.message;
        req.session.message = "";
        let obj = req.params.id;
        res.render('theatre/Home/add_food', {
            "layout": "./layout/layout.ejs", id: obj, message
        })
    } catch (error) {
        res.render('error/500')
        console.log(error);
    }
})
// delete food 
route.get('/delete/food/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id;
        let theatreId = req.session.theatreOwn._id;
        let obj = { _id: id, theatreOwner: theatreId }
        let del = await database_helper.DeleteFood(obj).then(r => r).catch(e => console.log(error))
        console.log(del)
        if (del) {
            // removing image
            fs.unlinkSync(`uploads/${del.image.image_url}`)
            res.redirect(`/theatre/shows/food/${del.theatreId}`);
        } else throw new error;
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

module.exports = route;