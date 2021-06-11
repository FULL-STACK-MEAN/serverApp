const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const signUp = async (userData) => {
    try {
        const user = new User({
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            password: bcrypt.hashSync(userData.password, 10)
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