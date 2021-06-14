const express = require('express');
const app = express();
const { signUp } = require('../services/auth');
const { ErrorHandler } = require('../helpers/errors');

app.post('/signup', async (req, res, next) => {
    
    try {
        if(req.body.name === undefined || 
           req.body.surname === undefined ||
           req.body.email === undefined ||
           req.body.password === undefined) {
            throw new ErrorHandler(404, 'name, surname, email and password fields are mandatory')
        }
        const userSaved = await signUp(req.body);
        res.status(200).json({
            message: 'El usuario fue registrado correctamente',
            userSaved
        })
    } catch(err) {
        return next(err);
    }
})

module.exports = app;