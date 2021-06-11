const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());

const port = 3000;

// const users = require('./routes/users');
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

// app.use('/users', users);
app.use('/auth', auth);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})