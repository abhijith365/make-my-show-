const mongoose = require('mongoose')

const TheatreOwn = new mongoose.Schema({
    phone: {
        type: String
    },
    googleMail: {
        type: String
    },
    googleId: {
        type: String,
    },
    displayName: {
        type: String,
        default: "Guest"
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    image: {
        type: String,
        default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    userName: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    password: {
        type: String
    },
    theatreName: {
        type: String
    },
    theatreId: {
        type: String
    },
    status: {
        type: String,
        default: "Pending"
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("TheatreOwn", TheatreOwn)