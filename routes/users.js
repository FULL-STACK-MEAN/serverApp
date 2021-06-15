const express = require('express');
const { tokenVerification } = require('../middleware/tokenverification');
const app = express();

const User = require('../models/user');
const { getUser } = require('../services/users');

app.get('/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.params._id === undefined) {
            throw new ErrorHandler(404, '_id param mandatory');
        }
        const user = await getUser(req.params._id);
        res.status(200).json({
            user
        })
    } catch (err) {
        return next(err);
    }
})

module.exports = app;