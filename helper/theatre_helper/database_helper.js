const db = require('../../config/mongo.config')
const { ObjectId } = require('mongodb')
const coll = require('../collection')



module.exports = {
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
    }
}