const Sequalize = require('sequelize');
const { db } = require('../../DB/Sequelize');

const user = db.define(
  'users',
  {
    firstname: {
      type: Sequalize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequalize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequalize.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: Sequalize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = user;
