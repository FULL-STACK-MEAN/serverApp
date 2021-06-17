const express = require('express');
const { tokenVerification } = require('../middleware/tokenverification');
const app = express();
const { ErrorHandler } = require('../helpers/errors');

const User = require('../models/user');
const { getUser, getUsers, updateUserRole } = require('../services/users');

app.get('/', tokenVerification, async (req, res, next) => {
    try {
        const users = await getUsers();
        res.status(200).json({
            users
        })
    } catch(err) {
        return next(err);
    }
})

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

app.put('/role/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.params._id === undefined) {
            throw new ErrorHandler(404, '_id param mandatory');
        }
        if(req.body.role === undefined) {
            throw new ErrorHandler(404, 'role field mandatory');
        }
        const userUpdated = await updateUserRole(req.params._id, req.body.role);
        res.status(200).json({
            message: 'El usuario fue actualizado',
            userUpdated
        })
    } catch (err) {
        return next(err);
    }
})

module.exports = app;