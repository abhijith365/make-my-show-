const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
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
        default: "Guest"
    },
    lastName: {
        type: String,
    },
    image: {
        type: String,
        default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('User', UserSchema)