require('express-async-errors');
require('dotenv').config();
const express = require('express');
const entriesRouter = require('./Components/Entries/entriesRoutes');
const notFoundError = require('./MiddelWare/notFound');

const { ENTRIES_URI } = process.env;

const app = express();

// request body paser
app.use(express.json());

// Routes
app.use(ENTRIES_URI, entriesRouter);
app.use(notFoundError);

module.exports = app;
