require('dotenv').config();
require('./models/connection');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
var prosRouter = require('./routes/pros');
var colisRouter = require('./routes/colis');
var usersRouter = require('./routes/users');
var app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pros', prosRouter);
app.use('/colis', colisRouter);

module.exports = app;