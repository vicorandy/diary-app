const { StatusCodes } = require('http-status-codes');
const { InvalidIdError } = require('./entriesError');
const Entries = require('./entriesModel');

// FECTHING ALL ENTRIES
async function getAllEntries(req, res) {
  const entries = await Entries.findAll();
  const count = entries.length;
  res
    .status(StatusCodes.OK)
    .json({ message: 'All entries', data: entries, count });
}

// FETCHING A SINGLE ENTRY
async function getSingleEntry(req, res) {
  const { id } = req.params;
  const entry = await Entries.findOne({ where: { id } });
  const count = entry.length;
  if (!entry) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `no entry with the id: ${id}` });
    throw new InvalidIdError(`no entry with the id: ${id}`);
  }
  if (entry) {
    res
      .status(StatusCodes.OK)
      .json({ message: 'Request successful', data: entry, count });
  }
}

// CREATING A NEW ENTRY
async function createEntry(req, res) {
  const { title, entry } = req.body;
  const data = await Entries.create({
    title,
    entry,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ message: 'entry has been logged ', data });
}

// EDITING A SINGLE ENRTY
async function editEntry(req, res) {
  const { id } = req.params;
  const { entry, title } = req.body;

  if (!entry || !title) {
    res.status(StatusCodes.BAD_REQUEST);
    res.json({ message: 'please enter all fields' });
  }
  const data = await Entries.findOne({ where: { id } });
  if (!data) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `no entry with the id: ${id}` });
    throw new InvalidIdError(`no entry with the id: ${id}`);
  }
  if (data) {
    await Entries.update({ entry, title }, { where: { id } });
    res.status(StatusCodes.OK).json({ message: 'entry has been edited' });
  }
}

// DELETING A SINGLE ENTRY
async function deleteEntry(req, res) {
  const { id } = req.params;
  const data = await Entries.findOne({ where: { id } });

  if (!data) {
    res.status(StatusCodes.NOT_FOUND);
    res.json({ message: `no entry with the id: ${id}` });
    throw new InvalidIdError(`no entry with the id: id}`);
  }

  if (data) {
    await Entries.destroy({ where: { id } });
    res.status(StatusCodes.OK);
    res.json({
      message: `the entry with the id: ${id} has been deleted sucessfully`,
    });
  }
}

module.exports = {
  getAllEntries,
  getSingleEntry,
  createEntry,
  editEntry,
  deleteEntry,
};
