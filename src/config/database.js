import mongoose from 'mongoose'

const dbConfig = {
  user: null,
  pass: null,
  url: 'mongodb://localhost:27017/your-database',
}

export const initialDB = () => {
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
}
