require('express-async-errors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const express = require('express');
const entriesRouter = require('./Components/Entries/entriesRoutes');
const usersRouter = require('./Components/Users/userRoutes');
const notFoundError = require('./MiddelWare/notFound');

const { ENTRIES_URI, USERS_URI } = process.env;

const app = express();

// request body paser
app.use(express.json());

// swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use(ENTRIES_URI, entriesRouter);
app.use(USERS_URI, usersRouter);
app.use(notFoundError);

module.exports = app;
