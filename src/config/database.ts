import mongoose from 'mongoose'

require('dotenv').config()

const USERNAME = process.env.MONGODB_USERNAME
const PASSWORD = process.env.MONGODB_PASSWORD
const HOST = process.env.MONGODB_HOST
const PORT = process.env.MONGODB_PORT
const COLLECTION = process.env.MONGODB_DATABASE

const dbConfig = {
  user: USERNAME,
  pass: PASSWORD,
  url: `mongodb://${HOST}:${PORT}/${COLLECTION}`,
}

const initialMongoDB = () => {
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
      console.log('Successfully connected to the MongoDB database')
    })
    .catch((err) => {
      console.log('Could not connect to the MongoDB database:', err)
      process.exit()
    })
}

export default initialMongoDB
