const { StatusCodes } = require('http-status-codes');
const { InvalidIdError } = require('./entriesError');
const Entries = require('./entriesModel');

// FECTHING ALL ENTRIES
async function getAllEntries(req, res) {
  try {
    const { userid } = req.user;
    const entries = await Entries.findAll({ where: { userid } });
    const count = entries.length;
    res
      .status(StatusCodes.OK)
      .json({ message: 'All entries', data: entries, count });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: 'Something went wrong' });
  }
}

// FETCHING A SINGLE ENTRY
async function getSingleEntry(req, res) {
  try {
    const { userid } = req.user;
    const { id } = req.params;
    const entry = await Entries.findOne({ where: { id, userid } });
    if (!entry) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `no entry with the id: ${id}` });
      throw new InvalidIdError(`no entry with the id: ${id}`);
    }
    const count = entry.length;
    if (entry) {
      res
        .status(StatusCodes.OK)
        .json({ message: 'Request successful', data: entry, count });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: 'Something went wrong' });
  }
}

// CREATING A NEW ENTRY
async function createEntry(req, res) {
  try {
    const { userid } = req.user;
    const { title, entry } = req.body;
    const data = await Entries.create({
      title,
      entry,
      userid,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'entry has been logged ', data });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ messsage: 'Something went wrong' });
  }
}

// EDITING A SINGLE ENRTY
async function editEntry(req, res) {
  try {
    const { userid } = req.user;

    const { id } = req.params;
    const { entry, title } = req.body;

    if (!entry || !title) {
      res.status(StatusCodes.BAD_REQUEST);
      res.json({ message: 'please enter all fields' });
    }
    const data = await Entries.findOne({ where: { id, userid } });
    if (!data) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `no entry with the id: ${id}` });
      throw new InvalidIdError(`no entry with the id: ${id}`);
    }
    if (data) {
      await Entries.update({ entry, title }, { where: { id, userid } });
      res.status(StatusCodes.OK).json({ message: 'entry has been edited' });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: 'something went wrong' });
  }
}

// DELETING A SINGLE ENTRY
async function deleteEntry(req, res) {
  try {
    const { userid } = req.user;
    const { id } = req.params;
    const data = await Entries.findOne({ where: { id, userid } });

    if (!data) {
      res.status(StatusCodes.NOT_FOUND);
      res.json({ message: `no entry with the id: ${id}` });
      throw new InvalidIdError(`no entry with the id: id}`);
    }

    if (data) {
      await Entries.destroy({ where: { id, userid } });
      res.status(StatusCodes.OK);
      res.json({
        message: `the entry with the id: ${id} has been deleted sucessfully`,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: 'Something went wrong' });
  }
}

module.exports = {
  getAllEntries,
  getSingleEntry,
  createEntry,
  editEntry,
  deleteEntry,
};
