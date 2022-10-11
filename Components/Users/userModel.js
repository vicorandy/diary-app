const Sequalize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../../DB/Sequelize');

require('dotenv');

const User = db.define(
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

// Hook for hashing passwords
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
});

// Hook for comparing password
User.prototype.comparePassword = async (password, hash) => {
  const isCorrect = await bcrypt.compare(password, hash);
  return isCorrect;
};

// Creating json wed token
User.prototype.createJWT = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_lLIFETIME,
  });
  return token;
};

module.exports = User;
