const { StatusCodes } = require('http-status-codes');


const notFoundError = function (req, res) {
  res.status(StatusCodes.NOT_FOUND).send('routes does not exsit')
};

module.exports=notFoundError

