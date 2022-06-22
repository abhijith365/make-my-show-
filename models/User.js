const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    phone: {
        type: String,
        default: "0000000000"
    },
    googleMail: {
        type: String,
        default: "example@example.com"
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
        default: "Guest"
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