const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');


const feedRoutes = require('./routes/feed');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png'
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/jpeg'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};


app.use(bodyParser.json());

app.use(multer({storage: fileStorage, fileFilter:fileFilter}).single('image'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/feed', feedRoutes);

mongoose.connect(
    'mongodb+srv://restUser:WdnWyjuCpnlYflIb@rest-dev-cluster.ndeql.mongodb.net/messages?retryWrites=true&w=majority'
    ).then( result => {
        app.listen(3000);
    }).catch(
        err => console.log(err)
);
