const express = require('express');
const route = express.Router();
const db = require('../../helper/user_helper/user_db_helper');
const { ObjectId } = require('mongodb');
const { ensureAuth, ensureGuest } = require('../../middleware/isUser')


//for showing result only for city based
route.get('/city/:id', ensureAuth, async (req, res) => {
    res.send(req.params.id)
})


module.exports = route;