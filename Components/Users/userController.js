const { StatusCodes } = require('http-status-codes');
const User = require('./userModel');

// FOR CREATING A USER ACCOUNT
async function signUp(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
    });

    res.status(StatusCodes.CREATED);
    res.json({ message: 'user account was created successfully' }, user);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(StatusCodes.UNAUTHORIZED);
      res.json({
        message:
          'This email address has already been registered to an account. ',
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ message: 'something went wrong' });
    }
  }
}

// FOR LOGGING INTO A USER ACCOUNT
async function signIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(StatusCodes.BAD_GATEWAY);
    res.json({ message: 'please enter your email and password' });
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED);
    res.json({ message: 'invalid username or password' });
  }

  const hash = user.password;
  const isCorrect = await user.comparePassword(password, hash);

  if (!isCorrect) {
    res.status(StatusCodes.UNAUTHORIZED);
    res.json({ message: 'invalid username or password' });
  }
  // send web token
  res.status(StatusCodes.OK);
  res.json({ message: 'password is correct' });
}

async function deleteAccount(req, res) {
  res.send('delete acc');
}

module.exports = { signUp, signIn, deleteAccount };
