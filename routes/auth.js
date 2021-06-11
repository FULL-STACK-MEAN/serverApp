const express = require('express');
const app = express();
const { signUp } = require('../services/auth');

app.post('/signup', async (req, res) => {
    
    try {
        const userSaved = await signUp(req.body);
        res.status(200).json({
            message: 'El usuario fue registrado correctamente',
            userSaved
        })
    } catch(err) {
        res.status(500).json({
            message: 'El servidor se encuentra fuera de servicio'
        })
    }
})

module.exports = app;