const express = require('express');
const {
  getAllEntries,
  getSingleEntry,
  createEntry,
  editEntry,
} = require('../controller/main');

const entriesRouter = express.Router();

entriesRouter.route('/').get(getAllEntries);
entriesRouter.route('/:id').get(getSingleEntry);
entriesRouter.route('/').post(createEntry);
entriesRouter.route('/:id').put(editEntry);

module.exports = entriesRouter;
