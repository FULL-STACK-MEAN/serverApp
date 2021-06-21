class ErrorHandler extends Error {

    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const setErrorResponse = (err, res) => {
    res.status(err.statusCode || 500).json({
        message: err.message
    })
}

module.exports = {
    ErrorHandler,
    setErrorResponse
}