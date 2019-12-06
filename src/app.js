import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mongoose from 'mongoose'
import dbConfig from './config/database.config'

import indexRouter from './routes/index'

let app = express()

// view engine setup
app.set('views', path.join(`${__dirname}/../`, 'views'))
app.set('view engine', 'pug')

app.all('*', cors()) // allow middleware cors
app.use(logger('dev'))
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(`${__dirname}/../`, 'public')))

// Connecting to the database
mongoose.Promise = global.Promise
mongoose
  .connect(dbConfig.url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
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
