var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var dbTest = require('./helpers/dbTest');

var indexRouter = require('./routes/index');
var movieRouter = require('./routes/movie');
var app = express();

// db
const dbName = 'mustwatch';
// uncomment to test mongo
// dbTest.test(mongoose)
mongoose.connect('mongodb://localhost:27017/' + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('debug', true);
const conn = mongoose.connection;
conn
  .on('open', () => console.log('------- Connected to db ' + dbName))
  .catch(err => console.log(err));
mongoose.Promise = Promise;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// view engine setup
//app.use(express.static(path.join(__dirname + '/views')));
//app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);
app.use('/api/movies', movieRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
