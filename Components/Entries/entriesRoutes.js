const express = require('express');
const auth = require('../../MiddelWare/auth');

const {
  getAllEntries,
  getSingleEntry,
  createEntry,
  editEntry,
  deleteEntry,
} = require('./entriesController');

const entriesRouter = express.Router();

entriesRouter.route('/').get(auth, getAllEntries);
entriesRouter.route('/:id').get(auth, getSingleEntry);
entriesRouter.route('/').post(auth, createEntry);
entriesRouter.route('/:id').put(auth, editEntry);
entriesRouter.route('/:id').delete(auth, deleteEntry);

module.exports = entriesRouter;
