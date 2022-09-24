const { StatusCodes } = require('http-status-codes');
const { InvalidIdError } = require('./entriesError');
const Entries = require('./entriesModel');

async function getAllEntries(req, res) {
  const entries = await Entries.findAll();
  res.status(StatusCodes.OK).json({ data: entries });
}

async function getSingleEntry(req, res) {
  const { id } = req.params;
  const entry = await Entries.findOne({ where: { id } });
  if (!entry) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `no entry with the id: ${id}` });
    throw new InvalidIdError(`no entry with the id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ data: entry });
}

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

async function editEntry(req, res) {
  const { id } = req.params;
  const { entry } = req.body;

  const data = await Entries.findOne({ where: { id } });
  if (!data) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `no entry with the id: ${id}` });
    throw new InvalidIdError(`no entry with the id: ${id}`);
  }

  await Entries.update({ entry }, { where: { id } });
  res.status(StatusCodes.OK).json({ message: 'entry has been edited' });
}
module.exports = { getAllEntries, getSingleEntry, createEntry, editEntry };
