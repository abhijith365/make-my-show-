const express = require('express')
const route = express.Router()
const fs = require('fs');
const _ = require('underscore')
const { ObjectId } = require('mongodb')


const db = require('../../helper/theatre_helper/database_helper')
const { ensureAuth } = require('../../middleware/isTheater')

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


//theatre section
// add theatre page 

route.get('/', ensureAuth, (req, res) => {
    try {
        let message = req.session.message;
        req.session.message = "";
        res.render("theatre/Home/add_theatre", {
            "layout": './layout/layout',
            message
        })
    } catch (error) {
        console.log(error.message);
    }

})
// add theatre POST request
route.post('/', ensureAuth, upload.array('images'), async (req, res) => {
    try {
        let image = req.files.map((e) => {
            return ({ image_url: e.filename })
        })


        req.body.application_complete = false;
        req.body.images = image;
        req.body.createdAt = Date.now();
        req.body.theatreOwner = req.session.theatreOwn._id;


        let data = await db.addTheatre(req.body).then((res) => { return (res.status) }).catch((e) => console.log(e.message))
        if (data == true) {
            res.redirect('/theatre/theatre/home')
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

        req.session.theatreName = `${data.theatreName} - ${data.BuildingName} - ${data.city}`;
        res.render("theatre/Home/theatre.ejs", {
            "layout": './layout/layout', data
        })
    } catch (err) {
        console.log(err);
    }

})
//Edit theatre -> GET request
route.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id
        let theatreId = req.session.theatreOwn._id;

        let data = await db.findTheatre(id).then((e) => e).catch(e => console.log(e.message))

        if (data) {
            res.render("theatre/Home/edit_theatre.ejs", {
                "layout": './layout/layout', data
            })
        } else throw new error;
    } catch (err) {
        res.render('error/500')
        console.log(err);
    }

})
// Edit theatre -> POST request
route.post('/edit/:id', ensureAuth, upload.array('images'), async (req, res) => {
    try {


        let image = req.files.map((e) => {
            //http://localhost:3000/uploads/' +
            return (e.filename)
        })

        let id = req.params.id;
        let owner_id = req.session.theatreOwn._id;
        req.body.images = image;
        req.body.theatreOwner = owner_id;
        req.body.theatre_id = id;

        let data = await db.updateTheatre(req.body).then((res) => res).catch((e) => console.log(e.message))

        if (data) {
            res.redirect(`/theatre/theatre/home`)
        } else {
            req.session.message = "Movie already exits"
            res.redirect(`/theatre/theatre/edit/movies/${id}`)
        }
    } catch (err) {
        console.log(err)
        res.render('error/500')

    }


})
// delete theatre 
route.get('/delete/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id;
        let theatreId = req.session.theatreOwn._id;
        let obj = { _id: id, theatreOwner: theatreId }
        let del = await database_helper.deleteTheatre(obj).then(r => r).catch(e => console.log(error))
        if (del) {
            del.images.map((e) => {
                fs.unlinkSync(`uploads/${e.image_url}`)
            })
            res.redirect(`/theatre/theatre/home`);
        } else throw new error;
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }

})
// screen section

// screen home
route.get('/halls/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id;
        let theatreName = req.session.theatreName;
        let theatreOwner = req.session.theatreOwn._id;
        let obj = { id: id, theatreOwner: theatreOwner }

        let data = await db.showScreen(obj).then(r => r).catch(e => console.log(e.message));


        res.render("theatre/Home/theatre_hall", {
            "layout": './layout/layout',
            data,
            id,
            theatreName
        })
    } catch (err) {
        console.log(err.message);
    }

})
// single screen page
route.get('/screen/:id', ensureAuth, async (req, res) => {
    try {
        let theatreId = req.query.tid;
        let screenId = req.params.id;
        let theatreOwner = req.session.theatreOwn._id;
        let obj = {
            theatreId: theatreId, _id: screenId, theatreOwner: theatreOwner
        }

        let data = await database_helper.showSingleScreen(obj).then(data => data).catch(e => e);

        let theatreName = req.session.theatreName;
        if (data) {
            res.render('theatre/Home/screen', {
                "layout": './layout/layout',
                data,
                theatreName
            })
        } else throw new error;

        // res.redirect('/theatre')
    } catch (error) {
        console.log(error.message)
        res.render('error/500')
    }

})
// add screen page 
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
        res.render('error/500')
        console.log(err.message);
    }

})

// add screen POST request
route.post('/hall/:id', ensureAuth, async (req, res) => {
    try {


        let tol = req.body.total_seats;

        let hallInp = {
            screenName: req.body.screenName,
            screenId: req.body.screenId,
            total_seats: tol.map(a => parseInt(a)).reduce((a, b) => (a + b)),
            theatreOwner: ObjectId(req.session.theatreOwn._id),
            theatreId: ObjectId(req.params.id),
            createdAt: Date.now()
        }
        // restuctring seats details
        let array = [];
        array.push(req.body.seats_tag_name)
        array.push(req.body.total_seats)
        array.push(req.body.seats_price)
        array.push(req.body.seats_category)
        let arr = _.zip(array[0], array[1], array[2], array[3], array[4]).map((x => ({
            seats_tag_name: x[0], total_seats: x[1], seats_price: x[2], seats_category: x[3]
        })))

        let seatsRetails = {
            total_row: req.body.seats_col_num,
            seats_details: arr,

        }
        hallInp.seatsRetails = seatsRetails;

        let id = req.params.id
        //obj for check uuid exit or not 
        let obj = { screenId: req.body.screenId, theatreId: id }

        //CHECKING SCREEN EXIT OR NOT IF NOT ADDING NEW DATA
        let screenExist = await db.checkScreen(obj).then(re => re).catch(e => e);
        if (!screenExist) {
            let screen = await db.addScreen(hallInp).then(res => res)
            res.redirect(`/theatre/theatre/halls/${id}`)
        }
        else {
            req.session.message = "screen id exits"
            res.redirect(`/theatre/theatre/halls/add/${id}`)
        }

    } catch (err) {
        res.render('error/500')
        console.log(err);
    }

})
// delete screen
route.get('/delete/halls/:id', ensureAuth, async (req, res) => {
    try {
        let _id = req.params.id
        let data = await db.deleteScreen(_id).then(r => r).catch(e => console.log(e.message));


        if (data) {
            res.redirect('/theatre/theatre/home')
        } else throw new error;

    } catch (err) {
        console.log(err.message);
    }

})


// movies section

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
        res.render('error/500')
        console.log(err.message);
    }

})

// add movies page
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
// add movie post request
route.post('/add/movie/:id', ensureAuth, upload.array('images'), async (req, res) => {
    try {
        let id = req.params.id
        let image = req.files.map((e) => {
            //'http://localhost:3000/uploads/' + 
            return ({ image_url: e.filename })
        })


        req.body.images = image
        req.body.theatreOwner = id
        req.body.ReleseDate = new Date(req.body.ReleseDate)


        let data = await db.addMovie(req.body).then((res) => { return (res.status) }).catch((e) => console.log(e.message))

        if (data) {
            res.redirect(`/theatre/theatre/movies/${id}`)
        } else {
            req.session.message = "Movie already exits"
            res.redirect(`/theatre/theatre/add/movies/${id}`)
        }
    } catch (err) {
        res.render('error/500')
        console.log(err)
    }


})

// Edit movies page
route.get('/edit/movies/:id', ensureAuth, async (req, res) => {
    try {
        let message = req.session.message;
        let id = req.params.id;
        let ownId = req.session.theatreOwn._id;
        let obj = { theatreOwner: ownId, movieId: id };
        let data = await database_helper.showSingleMovie(obj).then(re => re).catch(e => console.log(e.message));
        req.session.message = "";

        res.render("theatre/Home/edit_movies", {
            "layout": './layout/layout',
            message,
            id,
            data
        })
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }


})
// Edit movie post request
route.post('/edit/movie/:id', ensureAuth, upload.array('images'), async (req, res) => {
    try {

        let image = req.files.map((e) => {
            //http://localhost:3000/uploads/' +
            return (e.filename)
        })
        req.body.ReleseDate = new Date(req.body.ReleseDate)
        let id = req.params.id;
        let owner_id = req.session.theatreOwn._id;
        req.body.images = image;
        req.body.theatreOwner = owner_id;

        let data = await db.updateMovie(req.body).then((res) => res).catch((e) => console.log(e.message))

        if (data) {
            res.redirect(`/theatre/theatre/movies/${owner_id}`)
        } else {
            req.session.message = "Movie already exits"
            res.redirect(`/theatre/theatre/edit/movies/${id}`)
        }
    } catch (err) {
        console.log(err)
        res.render('error/500')

    }


})
// delete movie 
route.get('/delete/movies/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id;
        let theatreId = req.session.theatreOwn._id;
        let obj = { _id: id, theatreOwner: theatreId }
        let del = await database_helper.deleteMovie(obj).then(r => r).catch(e => console.log(error))
        if (del) {
            del.images.map((e) => {
                fs.unlinkSync(`uploads/${e.image_url}`)
            })

            res.redirect(`/theatre/theatre/movies/${theatreId}`);
        }
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }

})
// view single movie
route.get('/view/movies/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id;
        let owner_id = req.session.theatreOwn._id;
        let obj = { _id: id, theatreOwner: owner_id };
        let user = await database_helper.viewMovie(obj).then(d => d).catch(e => e.message);

        if (user) {
            res.render('theatre/Home/movie', {
                layout: "./layout/layout.ejs",
                data: user
            })
        } else throw new error;
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})


module.exports = route