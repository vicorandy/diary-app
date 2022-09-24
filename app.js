require('express-async-errors');
require('dotenv').config();
const express = require('express');
const entriesRouter = require('./Entries/entriesRoutes');
const notFoundError = require('./MiddelWare/notFound');

const app = express();

// request body paser
app.use(express.json());

// Routes
app.use('/api/v1/entries', entriesRouter);
app.use(notFoundError);

module.exports = app;
