const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = 3000;

const mongoURI = 'mongodb://localhost:27017/app4'; // en la ruta definimos la base de datos
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(mongoURI, options)
        .then(() => console.log('Dataserver connected'))
        .catch(err => console.log(err));


app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})