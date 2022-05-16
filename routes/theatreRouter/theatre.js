const express = require('express')
const route = express.Router()
const db = require('../../helper/theatre_helper/database_helper')
const { ensureAuth } = require('../../middleware/isTheater')


route.get('/', ensureAuth, (req, res) => {
    let message = req.session.message;
    req.session.message = "";
    res.render("theatre/Home/add_theatre", {
        "layout": './layout/layout',
        message
    })
})
route.post('/', ensureAuth, async (req, res) => {
    req.body.theatreOwner = req.session.theatreOwn._id
    console.log(req.body)
    let data = await db.addTheatre(req.body).then((res) => { return (res.status) }).catch((e) => console.log(e.message))
    if (data == true) {
        res.redirect('/theatre/')
    } else {
        req.session.message = "User already exits"
        res.redirect('/theatre/theatre')
    }

})

module.exports = route