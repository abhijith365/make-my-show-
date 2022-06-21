const db = require('../../config/mongo.config')
const { ObjectId } = require('mongodb')
const coll = require('../collection')


module.exports = {
    // all running movies
    runningMovies: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.getDb().collection(coll.show).aggregate(
                [
                    {
                        '$match': {
                            'showByDate.endDate': {
                                '$gte': new Date()
                            },

                        }
                    }, {
                        '$lookup': {
                            'from': 'movies',
                            'localField': 'movieId',
                            'foreignField': '_id',
                            'as': 'movies'
                        }
                    }, {
                        '$project': {
                            'movies': 1,
                            '_id': 0
                        }
                    }, {
                        '$limit': 10
                    }

                ]
            ).toArray();
            if (data) {
                resolve(data);
            } else {
                resolve(false);
            }
        })
    }, runningMoviesAll: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.getDb().collection(coll.show).aggregate(
                [
                    {
                        '$match': {
                            'showByDate.endDate': {
                                '$gte': new Date()
                            },

                        }
                    }, {
                        '$lookup': {
                            'from': 'movies',
                            'localField': 'movieId',
                            'foreignField': '_id',
                            'as': 'movies'
                        }
                    }, {
                        '$project': {
                            'movies': 1,
                            '_id': 0
                        }
                    }

                ]
            ).toArray();
            if (data) {
                resolve(data);
            } else {
                resolve(false);
            }
        })
    },
    singleShow: (obj) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.getDb().collection(coll.movie).aggregate([
                {
                    $match: {
                        "_id": ObjectId(obj)
                    }
                }
            ]).toArray();
            if (data) {
                resolve(data)
            } else {
                resolve(false)
            }
        })
    },
    //show all theatre running movie
    runningTheatre: (obj) => {
        return new Promise(async (resolve, reject) => {
            let date = new Date(obj.date)
            let data = await db.getDb().collection(coll.show).aggregate([

                {
                    '$match': {
                        'movieId': new ObjectId(obj.id),
                        'showByDate.endDate': {
                            '$gte': new Date(date)
                        },
                        'showByDate.startDate': {
                            '$lte': new Date(date)
                        }
                    }
                }
                , {
                    '$lookup': {
                        'from': 'screens',
                        'localField': 'screenId',
                        'foreignField': '_id',
                        'as': 'screens'
                    }
                }, {
                    '$lookup': {
                        'from': 'theatres',
                        'localField': 'screens.theatreId',
                        'foreignField': '_id',
                        'as': 'theatres'
                    }
                }, {
                    '$lookup': {
                        'from': 'movies',
                        'localField': 'movieId',
                        'foreignField': '_id',
                        'as': 'movies'
                    }
                }, {
                    '$project': {
                        '_id': 1,
                        'showByDate': 1,
                        'showByDay': 1,
                        'totalShowDays': 1,
                        'totalShowsInDay': 1,
                        'theatres': 1,
                        'movies': 1
                    }
                }
            ]).toArray()
            if (data) {
                resolve(data)
            } else {
                resolve(false)
            }
        })
    },
    //upcoming movie details
    upcomingMovies: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.getDb().collection(coll.movie).aggregate([
                {
                    '$match': {
                        'ReleseDate': {
                            '$gt': new Date()
                        }
                    }
                }, {
                    '$limit': 10
                }
            ]).toArray()
            if (data) {
                resolve(data)
            } else {
                resolve(false)
            }
        })

    },
    //upcoming movie details
    upcomingMoviesAll: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.getDb().collection(coll.movie).aggregate([
                {
                    '$match': {
                        'ReleseDate': {
                            '$gt': new Date()
                        }
                    }
                }
            ]).toArray()
            if (data) {
                resolve(data)
            } else {
                resolve(false)
            }
        })

    },
    // fetching seat details
    seatDeatails: (obj) => {
      
        return new Promise(async (resolve, reject) => {

            let data = await db.getDb().collection(coll.seat).aggregate([
                {
                    '$match': {
                        'showId': new ObjectId(obj.id)
                    }
                }, {
                    '$unwind': {
                        'path': '$show_seats'
                    }
                }, {
                    '$unwind': {
                        'path': '$show_seats.showByDate.shows'
                    }
                }, {
                    '$match': {
                        'show_seats.showByDate.ShowDate': obj.date,
                        'show_seats.showByDate.shows.showTime': obj.time
                    }
                },
                {
                    '$lookup': {
                        'from': 'movies',
                        'localField': 'movieId',
                        'foreignField': '_id',
                        'as': 'movie'
                    }
                }, {
                    '$lookup': {
                        'from': 'screens',
                        'localField': 'screenId',
                        'foreignField': '_id',
                        'as': 'screen'
                    }
                }, {
                    '$lookup': {
                        'from': 'theatres',
                        'localField': 'screen.theatreId',
                        'foreignField': '_id',
                        'as': 'theatre'
                    }
                }, {
                    '$lookup': {
                        'from': 'shows',
                        'localField': 'showId',
                        'foreignField': '_id',
                        'as': 'show'
                    }
                }, {
                    '$lookup': {
                        'from': 'foods',
                        'localField': 'screen.theatreId',
                        'foreignField': 'theatreId',
                        'as': 'foods'
                    }
                }, {
                    '$project': {
                        '_id': 1,
                        'show_seats': 1,
                        'movie': 1,
                        'theatre': 1,
                        'show': 1,
                        'screen': 1,
                        'foods': 1
                    }
                }
            ]).toArray();

            if (data) {
                resolve(data)
            } else {
                resolve(false)
            }
        })

    },
    findAmt: (arr) => {
        return new Promise(async (res, rej) => {

            let data = await db.getDb().collection(coll.seat).aggregate([
                {
                    '$unwind': {
                        'path': '$show_seats'
                    }
                }, {
                    '$unwind': {
                        'path': '$show_seats.showByDate.shows'
                    }
                }, {
                    '$unwind': {
                        'path': '$show_seats.showByDate.shows.showSeats'
                    }
                }, {
                    '$match': {
                        'show_seats.showByDate.shows.showSeats._id':
                        {
                            '$in': arr

                        }
                    }
                }
            ]).toArray()

            if (data) {
                res(data)
            } else {
                res(false)
            }
        })
    },


    BookSeats: (obj, user) => {
        return new Promise(async (res, rej) => {
            let data = await db.getDb().collection(coll.seat).updateOne(
                {
                    "show_seats.showByDate.shows.showSeats._id": obj
                },
                {
                    $set: {
                        "show_seats.$[].showByDate.shows.$[].showSeats.$[elem].seat_status": true,
                        "show_seats.$[].showByDate.shows.$[].showSeats.$[elem].user_id":user
                    }
                },
                {
                    arrayFilters: [{ "elem._id": obj }]
                }
            )

            if (data) {
                res(data)
            } else {
                res(false),
                    rej("rejected")
            }
        })
    },
    TicketCreate: (obj) => {
        return new Promise(async (res, rej) => {

            let ticketData = await db.getDb().collection(coll.ticket).insertOne(obj)

            if (ticketData) {
                res(ticketData)
            } else {
                res(false),
                    rej("rejected")
            }
        })
    },
    TicketLookup: (obj) => {
        return new Promise(async (res, rej) => {
            let data = await db.getDb().collection(coll.ticket).aggregate(
                [
                    {
                        '$match': {
                            'user_id': obj
                        }
                    }, {
                        '$lookup': {
                            'from': 'seats',
                            'localField': 'ticketData.seat_id',
                            'foreignField': 'show_seats.showByDate.shows.showSeats._id',
                            'as': 'seat_details'
                        }
                    }, {
                        '$unwind': {
                            'path': '$seat_details'
                        }
                    }, {
                        '$unwind': {
                            'path': '$seat_details.show_seats'
                        }
                    }, {
                        '$unwind': {
                            'path': '$seat_details.show_seats.showByDate.shows'
                        }
                    }, {
                        '$unwind': {
                            'path': '$seat_details.show_seats.showByDate.shows.showSeats'
                        }
                    }
                    // }, {
                    //     '$match': {
                    //         'seat_details.show_seats.showByDate.shows.showSeats._id': {
                    //             '$in': obj
                    //         }
                    //     }
                    // }
                ]
            ).toArray()

            if (data) {
                res(data)
            } else {
                res(false)
            }
        })
    }
}

