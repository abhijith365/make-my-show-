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
            try {
                let theatre = await db.getDb().collection(coll.theatre).findOne({ _id: ObjectId(obj) })
                if (theatre) {
                    res(theatre)
                } else res(false)
            } catch (error) {
                console.log(error)
            }


        })
    },
    updateTheatre: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                hall = await db.getDb().collection(coll.theatre).updateOne({ "$and": [{ _id: ObjectId(obj.theatre_id) }, { theatreOwner: obj.theatreOwner }] }, {
                    "$set": {

                        theatreName: obj.theatreName,
                        BuildingName: obj.BuildingName,
                        address: obj.address,
                        city: obj.city,
                        theatreId: obj.theatreId,
                        theatreOwner: obj.theatreOwner,
                        images: obj.images,
                        Modified_date: (() => Date.now())()
                    }
                })
                res(hall)
            } catch (error) {
                console.log(error.message);
                res(false);

            }

        })
    },
    deleteTheatre: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let find = await db.getDb().collection(coll.theatre).findOne({ _id: ObjectId(obj._id), theatreOwner: obj.theatreOwner })
                let del = await db.getDb().collection(coll.theatre).deleteOne({ _id: ObjectId(obj._id), theatreOwner: obj.theatreOwner })
                let delHall = await db.getDb().collection(coll.screen).deleteMany({ theatre_id: obj._id })
                res(find);
            } catch (error) {
                console.log(error.message)
                res("delete rejected")
            }
        })
    },
    // add screen
    addScreen: (hallInp, seatsInp) => {
        return new Promise(async (res, rej) => {
            let hall = await db.getDb().collection(coll.screen).findOne({ $and: [{ screenId: hallInp.screenId }, { theatre_id: ObjectId(hallInp.theatre_id) }] })
            if (!hall) {

                let hall = await db.getDb().collection(coll.screen).insertOne(hallInp).then(res => res).catch(err => err);


                let update = await db.getDb().collection(coll.theatre).updateOne({ _id: hallInp.theatreId }, { "$set": { application_complete: true } })
                if (hall && update) {
                    res(hall)
                } else {
                    res(false)
                }
            } else res(false)

        })
    },
    showScreen: (obj) => {
        return new Promise(async (res, rej) => {
            let screen = await db.getDb().collection(coll.screen).find({ $and: [{ theatreOwner: ObjectId(obj.theatreOwner) }, { theatreId: ObjectId(obj.id) }] }).toArray()

            if (screen) {
                res(screen)
            }
            else {
                res(false)
            }
        })
    },
    checkScreen: (obj) => {
        return new Promise(async (res, rej) => {
            let screen = await db.getDb().collection(coll.screen).findOne({ $and: [{ theatreId: ObjectId(obj.theatreId) }, { screenId: obj.screenId }] });


            if (screen) {

                res(screen)
            }
            else {
                res(false)
            }
        })

    }
    ,
    showSingleScreen: (obj) => {
        return new Promise(async (res, rej) => {    //6292f70e86d5ac58a9291423?&tid=629087fb96e2a9f4bacc1a80
            let screen = await db.getDb().collection(coll.screen).findOne({ $and: [{ theatreId: ObjectId(obj.theatreId) }, { _id: ObjectId(obj._id) }] });


            if (screen) {

                res(screen)
            }
            else {
                res(false)
            }
        })
    },
    deleteScreen: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let del = await db.getDb().collection(coll.screen).deleteOne({ _id: ObjectId(obj) });

                if (del) {
                    res(true);
                }
                else throw new error;
            } catch (error) {
                console.log(error.message)
                res(false)
            }
        })
    },
    //show all screen
    showAllScreen: (obj) => {
        return new Promise(async (res, rej) => {
            let screen = await db.getDb().collection(coll.screen).find({ theatreOwner: ObjectId(obj) }).toArray()
            if (screen) {
                res(screen)
            }
            else {
                res(false)
            }
        })
    },
    //show all movies
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
    showSingleMovie: (obj) => {
        return new Promise(async (res, rej) => {
            let movie = await db.getDb().collection(coll.movie).findOne({ $and: [{ theatreOwner: obj.theatreOwner }, { _id: ObjectId(obj.movieId) }] });
            if (movie) {
                res(movie)
            }
            else {
                res(false)
            }
        })
    }
    ,
    // add movie
    addMovie: (obj) => {
        return new Promise(async (res, rej) => {
            obj.Created_date = Date.now();
            let movie = await db.getDb().collection(coll.movie).findOne({ $and: [{ movie_uid: obj.movie_uid }, { theatreOwner: obj.theatreOwner }] })
            console.log(movie)
            if (!movie) {
                let movie = await db.getDb().collection(coll.movie).insertOne(obj)
                res({ movie, status: true })
            } else {
                res({ status: false })
            }
        })
    },
    updateMovie: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                hall = await db.getDb().collection(coll.movie).updateOne({ "$and": [{ _id: ObjectId(obj.movie_id) }, { theatreOwner: obj.theatreOwner }] }, {
                    "$set": {

                        movieName: obj.movieName,
                        movie_uid: obj.movie_uid,
                        description: obj.description,
                        movieDuration: obj.movieDuration,
                        language: obj.language,
                        ReleseDate: obj.ReleseDate,
                        tlLinks: obj.tlLinks,
                        movieGenres: obj.movieGenres,
                        theatreOwner: ObjectId(obj.theatreOwner),
                        images: obj.images,
                        Modified_date: (() => Date.now())()
                    }
                })
                res(hall)
            } catch (error) {
                console.log(error.message);
                res(false);

            }

        })
    },
    deleteMovie: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let find = await db.getDb().collection(coll.movie).findOne({ _id: ObjectId(obj._id), theatreOwner: obj.theatreOwner })
                let del = await db.getDb().collection(coll.movie).deleteOne({ _id: ObjectId(obj._id), theatreOwner: obj.theatreOwner })

                res(find);
            } catch (error) {
                console.log(error.message)
                res(false)
            }
        })
    },
    viewMovie: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let find = await db.getDb().collection(coll.movie).findOne({ _id: ObjectId(obj._id), theatreOwner: obj.theatreOwner })
                res(find);
            } catch (error) {
                console.log(error.message);
                res(false)
            }
        })
    },
    ////lookup for movie and halls
    showCinema_screen: (obj) => {
        //=> obj = 
        return new Promise(async (res, rej) => {

            try {
                let result = await db.getDb().collection(coll.show).aggregate([
                    { $match: { "screen_id": obj } },
                    {
                        $lookup: {
                            from: coll.movie,
                            localField: "theatreOwn",
                            foreignField: "theatreOwner",
                            as: "all_Movies"
                        }

                    }, {
                        $unwind: "$all_Movies"
                    }
                ]).toArray();

                res(result)

            } catch (error) {
                console.log(error)
                rej(error)
            }


        })
    },
    AddShow: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let data = await db.getDb().collection(coll.show).findOne({ showUid: obj.showUid })

                if (data) {
                    res(false)
                } else {
                    let show = await db.getDb().collection(coll.show).insertOne(obj).then(re => re).catch(e => e);
                    let findShow = await db.getDb().collection(coll.show).findOne({ _id: show.insertedId })
                    let screen = await db.getDb().collection(coll.screen).findOne({ _id: obj.screenId });

                    if (show) {
                        let arr = []
                        arr.push({ findShow, screen });
                        res(arr)
                    }
                    res(false)


                }
            } catch (error) {
                console.log(error)
            }
        })
    },
    AddshowSeats: (obj) => {
        return new Promise(async (res, rej) => {
            let seatsCollection = await db.getDb().collection(coll.seat).insertOne(obj).then(res => res).catch(e => e);
            if (seatsCollection) {
                res(seatsCollection)
            } else res(false);
        })
    }
    ,
    // all shows
    RunningShows: (obj) => {
        return new Promise(async (res, rej) => {
            // find({ theatreOwner: obj }).toArray()
            let data = await db.getDb().collection(coll.show).aggregate(
                [{
                    $match: {
                        theatreOwner: ObjectId(obj),
                        'showByDate.endDate': {
                            '$gte': new Date()
                        }
                    }

                }, {
                    '$sort': {
                        'showByDate.startDate': 1
                    }
                },
                {
                    $lookup: {
                        from: coll.screen,
                        localField: "screenId",
                        foreignField: "_id",
                        as: "screen"

                    }
                },
                {
                    $lookup: {
                        from: coll.movie,
                        localField: "movieId",
                        foreignField: "_id",
                        as: "movie"
                    }
                },
                {
                    $lookup: {
                        from: coll.theatre,
                        localField: "theatreId",
                        foreignField: "_id",
                        as: "theatre"
                    }
                },
                {
                    $project: {
                        _id: 1, showUid: 1, showType: 1, showByDate: 1, screen: 1, movie: 1, theatreOwner: 1
                    }
                },

                ]
            ).toArray()

            if (data) {
                res(data)
            } else { res(false) }
        })
    },
    previouseShows: (obj) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.getDb().collection(coll.show).aggregate(
                [{
                    $match: {
                        theatreOwner: ObjectId(obj),
                        'showByDate.endDate': {
                            '$lt': new Date()
                        }
                    }

                }, {
                    '$sort': {
                        'showByDate.startDate': 1
                    }
                },
                {
                    $lookup: {
                        from: coll.screen,
                        localField: "screenId",
                        foreignField: "_id",
                        as: "screen"

                    }
                },
                {
                    $lookup: {
                        from: coll.movie,
                        localField: "movieId",
                        foreignField: "_id",
                        as: "movie"
                    }
                },
                {
                    $lookup: {
                        from: coll.theatre,
                        localField: "theatreId",
                        foreignField: "_id",
                        as: "theatre"
                    }
                },
                {
                    $project: {
                        _id: 1, showUid: 1, showType: 1, showByDate: 1, screen: 1, movie: 1, theatreOwner: 1
                    }
                },

                ]
            ).toArray()

            if (data) {
                resolve(data)
            } else { resolve(false) }
        })

    }
    ,
    // all foods
    AllFoods: (obj) => {
        return new Promise(async (res, rej) => {
            let data = await db.getDb().collection(coll.food).find({ theatreId: obj }).toArray();

            if (data) {
                res(data)
            } else { res(false) }
        })
    },
    AddFood: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let data = await db.getDb().collection(coll.food).findOne({ food_uid: obj.food_uid })

                if (data) {
                    res(false)
                } else {
                    let food = await db.getDb().collection(coll.food).insertOne(obj);
                    res(food)
                }
            } catch (error) {
                console.log(error)
            }
        })
    },
    DeleteFood: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let find = await db.getDb().collection(coll.food).findOne({ _id: ObjectId(obj._id), theatreOwn: obj.theatreOwner })
                let del = await db.getDb().collection(coll.food).deleteOne({ _id: ObjectId(obj._id), theatreOwn: obj.theatreOwner })

                res(find);

            } catch (error) {
                console.log(error);
                res(false)
            }
        })
    },
    AllTickets: () => {
        return new Promise(async (res, rej) => {
            let data = await db.getDb().collection(coll.ticket).aggregate(
                [
                    {
                        '$match': {
                            'seat_status': true
                        }
                    }, {
                        '$sort': {
                            'createdAt': -1
                        }
                    }
                ]
            ).toArray()
            if (data.length != 0) {
                res(data)
            } else {
                res(false)
            }
        })
    },
    TotalSell: () => {
        return new Promise(async (res, rej) => {
            let data = await db.getDb().collection(coll.ticket).aggregate(
                [
                    {
                        '$match': {
                            'seat_status': true
                        }
                    }, {
                        '$project': {
                            '_id': 0,
                            'total': 1
                        }
                    }
                ]
            )
                .toArray()
            if (data) {
                res(data)
            } else {
                res(false)
            }
        })
    }






}
