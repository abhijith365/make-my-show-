const db = require('../../config/mongo.config')
const { ObjectId } = require('mongodb')
const coll = require('../collection')



module.exports = {
    // add theatre page POST -> /theatre/theatre
    addTheatre: (obj) => {
        return new Promise(async (res, rej) => {
            let theatre = await db.getDb().collection(coll.theatre).findOne({ theatreId: obj.theatreId })
            if (!theatre) {
                let theatre = await db.getDb().collection(coll.theatre).insertOne(obj)
                res({ theatre, status: true })
            } else {
                res({ status: false })
            }
        })
    },
    // show theatre
    showTheatre: (obj) => {
        return new Promise(async (res, rej) => {
            let theatre = await db.getDb().collection(coll.theatre).find({ theatreOwner: obj.theatreOwner }).toArray()
            if (theatre) {
                res(theatre)
            }
            else {
                res(false)
            }
        })
    },
    // find sigle theatre
    findTheatre: (obj) => {
        return new Promise(async (res, rej) => {
            let theatre = await db.getDb().collection(coll.theatre).findOne({ _id: ObjectId(obj) })

            res(theatre)

        })
    },
    // add screen
    addScreen: (obj) => {
        return new Promise(async (res, rej) => {
            let hall = await db.getDb().collection(coll.screen).findOne({ $and: [{ screenId: obj.screenId }, { theatre_id: obj.theatre_id }] })
            console.log(obj, hall)
            if (!hall) {
                let hall = await db.getDb().collection(coll.screen).insertOne(obj)
                res(hall)
            } else {
                res(false)
            }

        })
    },
    showScreen: (obj) => {
        return new Promise(async (res, rej) => {
            let screen = await db.getDb().collection(coll.screen).find({ theatre_id: obj }).toArray()
            if (screen) {
                res(screen)
            }
            else {
                res(false)
            }
        })
    },
    //movies
    showMovies: (obj) => {
        return new Promise(async (res, rej) => {
            let movie = await db.getDb().collection(coll.movie).find({ theatreOwner: obj }).toArray()
            if (movie) {
                res(movie)
            }
            else {
                res(false)
            }
        })
    },
    // add movie
    addMovie: (obj) => {
        return new Promise(async (res, rej) => {
            let movie = await db.getDb().collection(coll.movie).findOne({ $and: [{ movie_uid: obj.movie_uid }, { theatreOwner: obj.theatreOwner }] })
            console.log(movie)
            if (!movie) {
                let movie = await db.getDb().collection(coll.movie).insertOne(obj)
                res({ movie, status: true })
            } else {
                res({ status: false })
            }
        })
    }
}