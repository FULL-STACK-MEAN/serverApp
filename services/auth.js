const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../helpers/errors');

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
        if(err.code === 11000) {
            throw new ErrorHandler(404, 'El email ya existe en otra cuenta');
        } else {
            throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
        }
    }
}

const getUser = async (email) => {
    try {
        const user = await User.findOne({email})
        return user;
    } catch (err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

module.exports = {
    signUp,
    getUser
}