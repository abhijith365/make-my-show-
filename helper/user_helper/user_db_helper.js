const db = require('../../config/mongo.config')
const { ObjectId } = require('mongodb')
const coll = require('../collection')


module.exports = {
    // all running movies
    runningMovies: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.getDb().collection(coll.show).aggregate([
                {
                    $match: {
                        "showByDate.endDate": { $gte: new Date() },
                        "showType": "Movie"
                    }
                },
                {
                    $lookup: {
                        from: 'movies',
                        localField: 'movieId',
                        foreignField: '_id',
                        as: 'movies'
                    }
                }
            ]).toArray();
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
                    $match: {
                        "movieId": ObjectId(obj)
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