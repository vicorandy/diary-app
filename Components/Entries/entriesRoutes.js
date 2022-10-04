const express = require('express');
const {
  getAllEntries,
  getSingleEntry,
  createEntry,
  editEntry,
  deleteEntry,
} = require('./entriesController');

const entriesRouter = express.Router();

entriesRouter.route('/').get(getAllEntries);
entriesRouter.route('/:id').get(getSingleEntry);
entriesRouter.route('/').post(createEntry);
entriesRouter.route('/:id').put(editEntry);
entriesRouter.route('/:id').delete(deleteEntry);

module.exports = entriesRouter;
