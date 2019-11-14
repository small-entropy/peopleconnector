import express from 'express'
import mongoose from 'mongoose'

import accessControl from './middleware/accessControl';

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
   console.log('Mongoose connection disconnected.');
   process.exit(0);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
   mongoose.connection.close(() => {
      console.log('Mongoose connection disconnected through app termination.');
      process.exit(0);
   });
});

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
app.use((req, res, next) => {
   Object.setPrototypeOf(req, app.request)
   Object.setPrototypeOf(res, app.response)
   req.res = res
   res.req = req
   next()
})

app.use(accessControl);

// Register route dispatchers
app.use(require('./api'))

// Export the server middleware
module.exports = app
