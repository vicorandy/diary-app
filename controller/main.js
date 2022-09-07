const getAllEntries = async function (req, res) {
  res.json({
    message: 'fecth',
  });
};

const getSingleEntry = async function (req, res) {
  const { id } = req.params;
  res.json({ id });
};

const createEntry = async function (req, res) {
  res.send('entry created');
};

const editEntry = async function (req, res) {
  res.send('entry has been edited');
};
module.exports = { getAllEntries, getSingleEntry, createEntry, editEntry };
