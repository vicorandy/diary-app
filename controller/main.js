const { StatusCodes } = require('http-status-codes');
const { InvalidIdError } = require('../error/index');
const {
  postEntry,
  fetchAllEntries,
  fetchSingleEntry,
  modifyEntry,
} = require('../db/queries');
const pool = require('../db/bd');

function getAllEntries(req, res) {
  pool.query(fetchAllEntries, (error, result) => {
    if (error) {
      throw error;
    }
    res.status(StatusCodes.OK).json(result.rows);
  });
}

function getSingleEntry(req, res) {
  const { id } = req.params;
  pool.query(fetchSingleEntry, [id], (error, result) => {
    if (!result.rows.length) {
      res.json({ message: 'no entry with such ID' });
      throw new InvalidIdError('invalid ID');
    }
    if (error) {
      throw error;
    }
    res.status(StatusCodes.OK).json(result.rows);
  });
}

function createEntry(req, res) {
  const { title, date, entry } = req.body;
  pool.query(postEntry, [title, date, entry], (error) => {
    if (error) {
      throw error;
    }
    res.status(StatusCodes.CREATED).send('entry was logged successfully');
  });
}

function editEntry(req, res) {
  const { id } = req.params;
  const { entry } = req.body;
  pool.query(fetchSingleEntry, [id], (error, result) => {
    if (!result.rows.length) {
      res.json({ message: 'no entry with such ID' });
      throw new InvalidIdError('invalid ID');
    }
  });
  pool.query(modifyEntry, [entry, id], (error) => {
    if (error) {
      throw error;
    }
    res.status(StatusCodes.OK).send('entry has been modified');
  });
}
module.exports = { getAllEntries, getSingleEntry, createEntry, editEntry };
