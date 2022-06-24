const express = require('express')
const route = express.Router();
const db = require('../../helper/theatre_helper/database_helper')
const { ensureAuth } = require('../../middleware/isTheater')
const fs = require('fs')
const _ = require('underscore')
const { ObjectId } = require('mongodb')



// multer for image uploads
const multer = require('multer')
const database_helper = require('../../helper/theatre_helper/database_helper');
const { isEmpty } = require('underscore');
const moment = require('moment');




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

        // making one array of start show and end show time
        let arr = [];
        arr.push(req.body.showStartTime);
        arr.push(req.body.showEndTime);

        let showByDay = _.zip(arr[0], arr[1]).map((a) => ({ startTime: a[0], endTime: a[1] }));
        //making one object of start date and end date of show
        let showByDate = { startDate: new Date(req.body.startDate), endDate: new Date(req.body.endDate) };



        let aDay = 86400000;
        let start_date = req.body.startDate;
        let end_date = req.body.endDate;
        let diff = Math.floor(
            (
                Date.parse(
                    end_date.replace(/-/g, '\/')
                ) - Date.parse(
                    start_date.replace(/-/g, '\/')
                )
            ) / aDay)


        let showObj = {
            showType: req.body.showName,
            showUid: req.body.show_uid,
            showByDate: showByDate,
            showByDay: showByDay,
            totalShowsInDay: parseInt(req.body.seats_col_num),
            totalShowDays: diff,
            movieId: ObjectId(req.body.movie_id),
            screenId: ObjectId(req.body.screen_id),
            theatreOwner: ObjectId(req.body.theatreOwn),
            createdAt: Date.now()
        }

        let seatObj = {
            totalShowByDay: req.body.seats_col_num,
            totalShowDays: diff,
            movieId: ObjectId(req.body.movie_id),
            screenId: ObjectId(req.body.screen_id),
            createdAt: Date.now(),

        }



        let show = await db.AddShow(showObj, seatObj).then(res => res).catch(e => e);


        if (show) {


            //complex object assignment start here :) 
            let show_seats = [];

            for (let i = 0; i < diff; i++) {
                let seatDetails = {};
                let date = new Date(showByDate.startDate);

                seatDetails.showByDate = {};

                seatDetails.showByDate.ShowDate = new Date(date.setDate(date.getDate() + i)).toISOString().split('T')[0];
                seatDetails.showByDate.shows = [];
                for (let j = 0; j < showObj.totalShowsInDay; j++) {
                    let dailyShow = {};

                    let time = showByDay[j].startTime;
                    let dateTime = `${seatDetails.showByDate.ShowDate}T${time}`;

                    dailyShow.showTime = dateTime;
                    let showSeats = [];


                    let total_row = parseInt(show[0].screen.seatsRetails.total_row)
                    let seat_details = show[0].screen.seatsRetails.seats_details;
                    for (let k = 0; k < total_row; k++) {
                        let total_seats = parseInt(seat_details[k].total_seats);
                        for (let l = 0; l < total_seats; l++) {
                            showSeats.push({
                                _id: new ObjectId(),
                                seat_number: `${l + 1}`,
                                tag_name: seat_details[k].seats_tag_name,
                                seat_status: false,
                                user_id: false,
                                price: seat_details[k].seats_price,
                                seats_category: seat_details[k].seats_category,
                                show_time: dateTime
                            })
                        }
                        dailyShow.showSeats = showSeats;

                    }
                   
                    seatDetails.showByDate.shows.push(dailyShow)
                }
                show_seats.push(seatDetails);
            }
            seatObj.showId = ObjectId(show[0].findShow._id);
            seatObj.show_seats = show_seats;
            // end 

            let addSeat = await db.AddshowSeats(seatObj).then(re => re).catch(e => e);



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
        let allShows = await db.RunningShows(obj).then(e => e).catch(e => e);

        let all;
        //if show list not empty 
        (!isEmpty(allShows)) ? all = allShows : all = false;

        res.render('theatre/Home/show_home', {
            "layout": "./layout/layout.ejs", arr: all
        })

    } catch (error) {
        res.render('error/500')
        console.log(error);
    }
})
//previouse shows 
route.post('/previouseShows/', ensureAuth, async (req, res) => {
    try {
        let obj = req.session.theatreOwn._id;
        let allShows = await db.previouseShows(obj).then(e => e).catch(e => e);

        let all;
        //if show list not empty 
        (!isEmpty(allShows)) ? all = allShows : all = false;

        res.json(JSON.stringify(all))

    } catch (error) {
        res.render('error/500')
        console.log(error);
    }
}),
    //previouse shows 
    route.post('/runningShows/', ensureAuth, async (req, res) => {
        try {
            let obj = req.session.theatreOwn._id;
            let allShows = await db.RunningShows(obj).then(e => e).catch(e => e);

            let all;
            //if show list not empty 
            (!isEmpty(allShows)) ? all = allShows : all = false;

            res.json(JSON.stringify(all))

        } catch (error) {
            res.render('error/500')
            console.log(error);
        }
    })
// food home page
route.get('/food/:id', ensureAuth, async (req, res) => {
    try {

        let obj = ObjectId(req.params.id);
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
        req.body.theatreId = ObjectId(req.body.theatreId)
        req.body.theatreOwn = ObjectId(req.session.theatreOwn._id);
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
            layout: "./layout/layout.ejs", id: obj, message
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

route.get('/ticket',async(req,res)=>{
    let data = await db.AllTickets();
    console.log(data)
    res.render('theatre/Home/ticket_home',{data})
})

module.exports = route;