const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { setErrorResponse, ErrorHandler } = require('./helpers/errors');

app.use(cors({origin: true, credentials: true}));

const port = 3000;

const users = require('./routes/users');
const auth = require('./routes/auth');


const mongoURI = 'mongodb://localhost:27017/app4'; // en la ruta definimos la base de datos
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

mongoose.connect(mongoURI, options)
        .then(() => console.log('Dataserver connected'))
        .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', users);
app.use('/auth', auth);

app.use('/*', () => {
    throw new ErrorHandler(404, 'Invalid path');
})

app.use((err, req, res, next) => {
    setErrorResponse(err, res);
})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})