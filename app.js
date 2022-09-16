require('express-async-errors');
require('dotenv').config();
const express = require('express');
const entriesRouter = require('./routes/routes');
const notFoundError = require('./error/notFound');
const { connectDB } = require('./db/Sequelize');

const app = express();
const PORT = process.env;

//
app.use(express.json());

// Routes
app.use('/api/v1/entries', entriesRouter);
app.use(notFoundError);

// Connecting to database and starting up server
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('server is listening on port 3000...');
    });
  } catch (error) {
    console.log(error.message);
  }
}
start();
