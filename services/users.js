const User = require('../models/user');

const getUser = async (_id) => {
    try {
        const user = await User.findOne({_id});
        return user;
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

module.exports = {
    getUser
}