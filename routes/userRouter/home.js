const express = require('express');
const route = express.Router();
const moment = require('moment')
const db = require('../../helper/user_helper/user_db_helper');
const { ObjectId } = require('mongodb');
const { ensureAuth, ensureGuest } = require('../../middleware/isUser')


//for showing result only for city based
route.get('/city/:id', ensureAuth, async (req, res) => {
    res.send(req.params.id)
})
// GET /allmovie => showing all running  movies
route.get('/allmovies', async (req, res) => {
    try {
        let movies_ad_shows = await db.runningMoviesAll().then(re => re).catch(err => err);
        let user = req.user || req.session.phone;


        if (movies_ad_shows) {
            // filtering data removing duplicate data
            let uniqueArray = movies_ad_shows.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.movies[0].movie_uid === value.movies[0].movie_uid
                ))
            )


            res.render('user/home/allMovies', {
                user,
                data: uniqueArray
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
        if (show) {
            res.render('user/home/movie', {
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
// @POST for ajax
//showing movie avialble theatres 
route.post('/booking/:id', ensureAuth, async (req, res) => {
    try {
       
        let id = req.params.id;
        let date = req.query.dt;
        date = date.split('T')[0].toString()

        let obj = { id, date }

        let user = req.user || req.session.phone;
        let data = await db.runningTheatre(obj).then(result => result).catch(err => err);

        if (data) {
            res.json({ data, obj })
        } else throw new error;
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
})


//single page for upcoming movie
route.get('/upcomingMovie/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let user = req.user || req.session.phone;
        let show = await db.singleShow(id).then(result => result).catch(err => err);

        if (show) {
            res.render('user/home/upcomingMove', {
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
// view all movies for upcoming movies
route.get('/upcomingMovieAll', async (req, res) => {
    try {
        let data = await db.upcomingMoviesAll().then(re => re).catch(err => err);
        let user = req.user || req.session.phone;

        if (data) {
            // filtering data removing duplicate data
            let uniqueArray = data.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.movie_uid === value.movie_uid
                ))
            )

            res.render('user/home/upcomingAllMovies', {
                user,
                data: uniqueArray
            })
        } else throw new error;
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }

})

// showing movie avialble theatres
route.get('/booking/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.params.id;
        let date = req.query.dt;
        date = date.split('T')[0].toString()

        let obj = { id, date }

        let user = req.user || req.session.phone;
        let data = await db.runningTheatre(obj).then(result => result).catch(err => err);

        if (data) {
            res.render('user/home/booking', {
                user,
                data,
                date,
                moment
            })
        } else throw new error;
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
})
// showing movie avialble theatres
route.post('/booking/:id', ensureAuth, async (req, res) => {
    try {
        let id = req.body.id;
        let date = req.body.date;
        date = date.split('T')[0].toString()

        let obj = { id, date }

        let user = req.user || req.session.phone;
        let data = await db.runningTheatre(obj).then(result => result).catch(err => err);


        if (data) {
            res.render('user/home/running_theatre', { data },
                function (err, html) {
                    res.send(html);
                })
        } else throw new error;
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
})

route.post('/booking/', ensureAuth, async (req, res) => {
    try {
        let id = req.body.Id;
        let date = req.body.date;
        date = date.split('T')[0].toString()

        let obj = { id, date }

        let user = req.user || req.session.phone;
        let data = await db.runningTheatre(obj).then(result => result).catch(err => err);

        if (data) {
            res.render('user/home/booking', {
                user,
                data,
                date,
                moment
            })
        } else throw new error;
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
})

//for seat section
//POST -> seat home page
route.get('/bookticket/seat/:id', ensureAuth, async (req, res) => {
    try {
        let user = req.user || req.session.phone;
        obj = {
            id: req.params.id,
            date: req.query.d,
            time: `${req.query.d}T${req.query.t}`
        }
        let data = await db.seatDeatails(obj).then(result => result).catch(error => error);

        function groupByArray(xs, key) {
            return xs.reduce(function (rv, x) {
                let v = key instanceof Function ? key(x) : x[key];
                let el = rv.find((r) => r && r.key === v);
                if (el) { el.values.push(x); }
                else { rv.push({ key: v, values: [x] },); }
                return rv;
            }, []);
        }
        let m = data[0].show_seats.showByDate.shows.showSeats;
       
        let array = [];
        z = groupByArray(m, 'seats_category')
        for (let i = 0; i < z.length; i++) {
            array[i] = [];
            array[i].push({ "category": z[i].key, "seat_details": groupByArray(z[i].values, 'tag_name') })

        }
        data[0].show_seats.showByDate.shows.showSeats = array
        
        if (array) {
            res.render('user/home/seat_layout', {
                user,
                data,
                moment
            })
        } else throw new error
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }

})
//POST -> seat home page
route.post('/bookticket/seat/', ensureAuth, async (req, res) => {
    try {
        let user = req.user || req.session.phone;
        let obj = {
            id: `${req.body.id}`,
            date: `${req.body.date}`
        }

        let data = await db.runningTheatre(obj).then(result => result).catch(err => err);
        if (data) {
            res.render('user/home/running_theatre.ejs', { data },
                function (err, html) {
                    res.send(html);
                })
        } else throw new error
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }

})

route.post('/payment_one', ensureAuth, async (req, res) => {

    req.session.order_data = req.body;
    res.render('user/home/payment_one', { data: req.body, moment, });
})



module.exports = route;