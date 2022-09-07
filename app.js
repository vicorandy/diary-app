const express = require('express');
const entriesRouter = require('./routes/routes');
const notFoundError = require('./error/notFound');
require('dotenv').config();
require('express-async-errors');

const app = express();
const PORT = process.env || 3000;

app.use(express.json());

app.use('/api/v1/entries', entriesRouter);
app.use(notFoundError);

app.listen(PORT, () => {
  console.log('servers are listening on port 3000...');
});
