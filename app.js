var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cors = require('cors')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var mongoose = require('mongoose')

var indexRouter = require('./routes/index')
// var usersRouter = require('./routes/users');

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.all('*', cors()) // allow middleware cors
app.use(logger('dev'))
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const dbConfig = require('./config/database.config.js')
mongoose.Promise = global.Promise

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Successfully connected to the database')
  })
  .catch(err => {
    console.log('Could not connect to the database. Exiting now...', err)
    process.exit()
  })

app.use('/v1', indexRouter)
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
