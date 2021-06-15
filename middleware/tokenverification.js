const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../helpers/errors');

exports.tokenVerification = async (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            throw new ErrorHandler(403, 'Token mandatory');
        }
        await jwt.verify(req.headers.authorization, 'dhgjshgdj', (err, decoded) => {
            if(err) {
                throw new ErrorHandler(403, 'Token expired');
            } else {
                next();
            }
        })
    } catch(err) {
        return next(err);
    }
}