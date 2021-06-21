const User = require('../models/user');
const { ErrorHandler } = require('../helpers/errors');

const getUsers = async () => {
    try {
        const users = await User.find({});
        return users;
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

const getUser = async (_id) => {
    try {
        const user = await User.findOne({_id});
        return user;
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

const updateUserRole = async (_id, role) => {
    try {
        const userSaved = await User.findByIdAndUpdate(_id, {$set: {role: role}}, {new: true});
        return userSaved;
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

module.exports = {
    getUser,
    getUsers,
    updateUserRole
}