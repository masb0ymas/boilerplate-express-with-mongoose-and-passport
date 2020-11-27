import mongoose from 'mongoose'

require('dotenv').config()

const USERNAME = process.env.MONGODB_USERNAME
const PASSWORD = process.env.MONGODB_PASSWORD
const AUTH_SOURCE = process.env.MONGODB_AUTH
const HOST = process.env.MONGODB_HOST
const PORT = process.env.MONGODB_PORT
const COLLECTION = process.env.MONGODB_DATABASE

const setUri = `mongodb://${HOST}:${PORT}/${COLLECTION}`
const setOptions = {
  user: USERNAME,
  pass: PASSWORD,
  authSource: AUTH_SOURCE,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}

const initialMongoDB = () => {
  // Connecting to the database
  mongoose.Promise = global.Promise
  mongoose
    .connect(setUri, setOptions)
    .then(() => {
      console.log('Successfully connected to the MongoDB database')
    })
    .catch((err) => {
      console.log('Could not connect to the MongoDB database:', err)
      process.exit()
    })
}

export default initialMongoDB
