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
            let data = await db.getDb().collection(coll.show).aggregate([
                {
                    '$match': {
                        'movieId': ObjectId(obj)
                    }
                }, {
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
    }


}