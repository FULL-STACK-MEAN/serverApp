const express = require('express');
const app = express();
const { signUp, getUser } = require('../services/auth');
const { ErrorHandler } = require('../helpers/errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { tokenVerification } = require('../middleware/tokenverification');

app.post('/signup', async (req, res, next) => {
    try {
        if(req.body.name === undefined || 
           req.body.surname === undefined ||
           req.body.email === undefined ||
           req.body.password === undefined) {
            throw new ErrorHandler(404, 'name, surname, email and password fields are mandatory')
        }
        const userSaved = await signUp(req.body);
        const token = jwt.sign({
            _id: userSaved._id,
            name: userSaved.name
        }, 'dhgjshgdj', {expiresIn: 30 * 60})
        res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'none', maxAge: 30 * 60 * 1000 });
        res.status(200).json({
            message: 'El usuario ha sido registrado correctamente',
            userState: {
                _id: userSaved._id,
                name: userSaved.name
            }
        })
    } catch(err) {
        return next(err);
    }
})

app.post('/login', async (req, res, next) => {
    
    try {
        if(req.body.email === undefined ||
           req.body.password === undefined) {
            throw new ErrorHandler(404, 'email and password fields are mandatory');
        }
        const user = await getUser(req.body.email);
        if(user === null) {
            throw new ErrorHandler(404, 'La cuenta de correo no existe');
        }
        if(!bcrypt.compareSync(req.body.password, user.password)) {
            throw new ErrorHandler(403, 'Contraseña incorrecta');
        } else {
            const token = jwt.sign({
                _id: user._id,
                name: user.name
            }, 'dhgjshgdj', {expiresIn: 30 * 60})
            res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'none', maxAge: 30 * 60 * 1000 });
            res.status(200).json({
                message: 'El usuario ha iniciado sesión correctamente',
                userState: {
                    _id: user._id,
                    name: user.name
                }
            })
        }
    } catch(err) {
        return next(err);
    }
})

app.get('/checktoken', tokenVerification, (req, res) => {
    res.status(200).json({
        user: req.user
    })
})

app.get('/logout', (req, res) => {
    res.cookie('token','', {httpOnly: true, secure: true, sameSite: 'none', maxAge: 0 });
    res.status(200).json({
        message: 'logout ok'
    })
})

module.exports = app;