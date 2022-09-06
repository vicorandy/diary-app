const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env || 3000;

app.use(express.json());

app.get('/api/v1/entries', (req, res) => {
  res.status(200);
  res.json({ messsage: 'fetch all entries' });
});

app.get('/api/v1/entries/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: id,
  });
});

app.listen(PORT, () => {
  console.log('servers are listening on port 3000...');
});
