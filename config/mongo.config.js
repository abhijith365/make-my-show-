const MongoClient = require('mongodb').MongoClient;

const state = {
    _db: null
}


module.exports = {

    connectToServer: function (callback) {
        const url = process.env.MONGO_URI
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            state._db = client.db();
            return callback(err);
        });

    },

    getDb: function () {
        return state._db;
    }
};

