const mongoose = require('mongoose');
const User = require('../models/user');

const signUp = async (userData) => {
    try {
        const user = new User({
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            password: userData.password
        })
        const userSaved = await user.save();
        return userSaved;
    } catch (err) {
        throw new Error('Error en base de datos');
    }
}

module.exports = {
    signUp
}