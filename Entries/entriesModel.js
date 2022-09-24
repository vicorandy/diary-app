const Sequelize = require('sequelize');
const { db } = require('../DB/Sequelize');

const Entries = db.define(
  'entries',
  {
    title: {
      type: Sequelize.STRING,
    },
    entry: {
      type: Sequelize.STRING,
    },

    date: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Entries;
