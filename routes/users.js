const express = require('express');
const app = express();

const User = require('../models/user');

app.post('/', (req, res) => {

    const user = new User({
        email: req.body.email,
        password: req.body.password
    })

    user.save((err, userSaved) => {
        if (err) {
            if(err.code === 11000) {
                return res.status(500).json({
                    message: 'El email ya se encuentra en uso'
                })
            } else {
                return res.status(500).json({
                    message: 'Error en base de datos, inténtelo de nuevo más tarde'
                })
            }
        }
        res.status(200).json({
            message: 'El usuario fue creado'
        })
    })
})

module.exports = app;