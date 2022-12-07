const Entries = require('./entriesModel');

// FECTHING ALL ENTRIES
// ////////////////////////////////////////////////////////////////////////////

async function getAllEntries(req, res) {
  try {
    const { userid } = req.user;
    const entries = await Entries.findAll({ where: { userid } });
    const count = entries.length;
    res.status(200).json({ message: 'All entries', data: entries, count });
  } catch (error) {
    res.status(500);
    res.json({ message: 'Something went wrong' });
  }
}
// ////////////////////////////////////////////////////////////////////////////

// FETCHING A SINGLE ENTRY
// ////////////////////////////////////////////////////////////////////////////

async function getSingleEntry(req, res) {
  try {
    const { userid } = req.user;
    const { id } = req.params;
    const entry = await Entries.findOne({ where: { id } });
    const specificEntry = await Entries.findOne({ where: { id, userid } });

    // checking if resource exists
    if (!entry) {
      res.status(404);
      res.json({ message: `no entry with the id: ${id}` });
      return;
    }
    const count = entry.length;

    // checking if resource belongs to the user
    if (!specificEntry) {
      res.status(401);
      res.json({
        message: 'You do not have authoriazation to access this resource',
      });
      return;
    }

    // performing the users request
    if (specificEntry) {
      res
        .status(200)
        .json({ message: 'Request successful', data: entry, count });
      return;
    }
  } catch (error) {
    res.status(500);
    res.json({ message: 'Something went wrong' });
  }
}

// CREATING A NEW ENTRY
// ////////////////////////////////////////////////////////////////////////////

async function createEntry(req, res) {
  try {
    const { userid } = req.user;
    const { title, entry } = req.body;

    // checking if all fields are provided
    if (!title || !entry) {
      res.status(400);
      res.json({
        message: 'please provide all a title and entry for your log',
      });
      return;
    }

    // creating a new entry
    const data = await Entries.create({
      title,
      entry,
      userid,
    });
    res.status(201).json({ message: 'entry has been logged', data });
  } catch (error) {
    res.status(500);
    res.json({ messsage: 'Something went wrong' });
  }
}
// ////////////////////////////////////////////////////////////////////////////

// EDITING A SINGLE ENRTY
// ////////////////////////////////////////////////////////////////////////////

async function editEntry(req, res) {
  try {
    const { userid } = req.user;
    const { id } = req.params;
    const { entry, title } = req.body;
    const oldEntry = await Entries.findOne({ where: { id } });
    const specificOldldEntry = await Entries.findOne({ where: { id, userid } });

    // checking for required input
    if (!entry || !title) {
      res.status(400);
      res.json({ message: 'please enter all fields' });
      return;
    }

    // checking if entry exist
    if (!oldEntry) {
      res.status(404);
      res.json({ message: `no entry with the id: ${id}` });
      return;
    }

    // checking if resource belongs to the user
    if (!specificOldldEntry) {
      res.status(401);
      res.json({
        message: 'you do not have authorization to edit this resource',
      });
      return;
    }

    // performing users request
    if (specificOldldEntry) {
      await Entries.update({ entry, title }, { where: { id, userid } });
      res.status(200).json({ message: 'entry has been edited' });
      return;
    }
  } catch (error) {
    res.status(500);
    res.json({ message: 'something went wrong' });
  }
}
// ////////////////////////////////////////////////////////////////////////////

// DELETING A SINGLE ENTRY
// ////////////////////////////////////////////////////////////////////////////

async function deleteEntry(req, res) {
  try {
    const { userid } = req.user;
    const { id } = req.params;
    const entry = await Entries.findOne({ where: { id } });
    const specificEntry = await Entries.findOne({ where: { id, userid } });

    // checking if resource exists
    if (!entry) {
      res.status(404);
      res.json({ message: `no entry with the id: ${id}` });
      return;
    }
    // checking if resource belongs to the user
    if (!specificEntry) {
      res.status(401);
      res.json({ message: 'you are no authorized to delete this account' });
      return;
    }

    // performing user request
    if (specificEntry) {
      await Entries.destroy({ where: { id, userid } });
      res.status(200);
      res.json({
        message: `the entry with the id: ${id} has been deleted sucessfully`,
      });
      return;
    }
  } catch (error) {
    res.status(500);
    res.json({ message: 'Something went wrong' });
  }
}
// ////////////////////////////////////////////////////////////////////////////

module.exports = {
  getAllEntries,
  getSingleEntry,
  createEntry,
  editEntry,
  deleteEntry,
};
