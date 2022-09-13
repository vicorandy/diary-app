// for creating  new entries
const postEntry =
  'INSERT INTO entries (title, date, entry) VALUES ($1 ,$2, $3)';

// for fecthing all entries
const fetchAllEntries = 'SELECT * FROM entries';

// for fectching a particular entry using ID
const fetchSingleEntry = 'SELECT * FROM entries WHERE id = $1';

// for editing a particular entry using ID
const modifyEntry = 'UPDATE entries SET entry = $1 WHERE id = $2';

module.exports = {
  postEntry,
  fetchAllEntries,
  fetchSingleEntry,
  modifyEntry,
};
