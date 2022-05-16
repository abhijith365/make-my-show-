const express = require('express')
const route = express.Router()


//@desc user home page
//@route GET /

route.get('/', async (req, res) => {
    try {
        console.log(req.session.phone)
        let user = req.user || req.session.phone;
        if (user) {
            res.render('user/index', {
                layout: './layout/layout.ejs',
                user
            })
        } else {
            res.render('user/index', {
                layout: './layout/layout.ejs',
                user: ""
            })
        }

    } catch (error) {
        console.error(error)

    }

})

route.get('/login', (req, res) => {
    res.render('user/login', {
        layout: './layout/layout.ejs'
    })
})


module.exports = route