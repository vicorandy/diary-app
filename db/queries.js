const postEntry =
  'INSERT INTO entries (title, date, entry) VALUES ($1 ,$2, $3)';
const fetchAllEntries = 'SELECT * FROM entries';
const fetchSingleEntry = 'SELECT * FROM entries WHERE id = $1';
const modifyEntry = 'UPDATE entries SET entry = $1 WHERE id = $2';
module.exports = { postEntry, fetchAllEntries, fetchSingleEntry, modifyEntry };
