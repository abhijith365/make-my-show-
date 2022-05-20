const express = require('express')
const route = express.Router()

const db = require('../../helper/theatre_helper/database_helper')
const { ensureAuth } = require('../../middleware/isTheater')

const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const upload = multer({ storage: storage })


// add theatre page 

route.get('/', ensureAuth, (req, res) => {
    let message = req.session.message;
    req.session.message = "";
    res.render("theatre/Home/add_theatre", {
        "layout": './layout/layout',
        message
    })
})
route.post('/', ensureAuth, upload.array('images'), async (req, res) => {
    try {
        let image = req.files.map((e) => {
            return ({
                imageUrl: 'http://localhost:3000/uploads/' + e.filename
            })
        })


        req.body.application_complete = false;
        req.body.images = image
        req.body.theatreOwner = req.session.theatreOwn._id


        let data = await db.addTheatre(req.body).then((res) => { return (res.status) }).catch((e) => console.log(e.message))
        if (data == true) {
            res.redirect('/theatre/')
        } else {
            req.session.message = "User already exits"
            res.redirect('/theatre/theatre')
        }
    } catch (err) {
        console.log(err)
    }


})

// theatre home page
route.get('/home', ensureAuth, async (req, res) => {
    try {
        req.body.theatreOwner = req.session.theatreOwn._id
        let data = await db.showTheatre(req.body).then((e) => e)

        res.render("theatre/Home/theatre_home.ejs", {
            "layout": './layout/layout', data
        })
    } catch (err) {
        console.log(err);
    }

})
// single theatre page 
route.get('/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id
        let data = await db.findTheatre(id).then((e) => e).catch(e => console.log(e.message))

        res.render("theatre/Home/theatre.ejs", {
            "layout": './layout/layout', data
        })
    } catch (err) {
        console.log(err);
    }

})
// screen home
route.get('/halls/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id.toString()
        let data = await db.showScreen(id).then(r => r).catch(e => console.log(e.message))

        res.render("theatre/Home/theatre_hall", {
            "layout": './layout/layout',
            data,
            id
        })
    } catch (err) {
        console.log(err);
    }

})
// screen page 
route.get('/halls/add/:id', ensureAuth, async (req, res) => {
    try {

        let message = req.session.message
        req.session.message = ""
        let id = req.params.id

        res.render("theatre/Home/add_theatre_hall", {
            "layout": './layout/layout', id,
            message
        })
    } catch (err) {
        console.log(err);
    }

})
// add screen 
route.post('/hall/:id', ensureAuth, async (req, res) => {
    try {
        let screen = await db.addScreen(req.body).then(res => res)
        let id = req.params.id
        if (screen) {
            res.redirect(`/theatre/theatre/halls/${id}`)
        }
        else {
            req.session.message = "screen id exits"
            res.redirect(`/theatre/theatre/halls/add/${id}`)
        }
    } catch (err) {
        console.log(err);
    }

})

// movies home page

route.get('/movies/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id
        let data = await db.showMovies(id).then((data) => data).catch((e) => console.log(e))

        if (data) {
            res.render("theatre/Home/movies", {
                "layout": './layout/layout',
                id,
                data

            })
        }

    } catch (err) {
        console.log(err.message);
    }

})

// add movies
route.get('/add/movies/:id', ensureAuth, (req, res) => {
    let message = req.session.message;
    let id = req.params.id;
    req.session.message = "";
    res.render("theatre/Home/add_movies", {
        "layout": './layout/layout',
        message,
        id
    })
})

route.post('/add/movie/:id', ensureAuth, upload.array('images'), async (req, res) => {
    try {
        let id = req.params.id
        let image = req.files.map((e) => {
            return ({
                imageUrl: 'http://localhost:3000/uploads/' + e.filename
            })
        })


        req.body.images = image
        req.body.theatreOwner = id


        let data = await db.addMovie(req.body).then((res) => { return (res.status) }).catch((e) => console.log(e.message))
        console.log(data)
        if (data) {
            res.redirect(`/theatre/theatre/movies/${id}`)
        } else {
            req.session.message = "Movie already exits"
            res.redirect(`/theatre/theatre/add/movies/${id}`)
        }
    } catch (err) {
        console.log(err)
    }


})



module.exports = route