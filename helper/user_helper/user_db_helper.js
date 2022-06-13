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
                            }
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
                    },

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
                            '$gt': new Date(date)
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
        // console.log(obj)
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
                        'localField': 'screen.theatreOwner',
                        'foreignField': 'theatreOwn',
                        'as': 'foods'
                    }
                }, {
                    '$project': {
                        '_id': 1,
                        'show_seats': 1,
                        'movie': 1,
                        'theatre': 1,
                        'show': 1,
                        'foods':1
                    }
                }
            ]).toArray();

            if (data) {
                resolve(data)
            } else {
                resolve(false)
            }
        })

    }



}