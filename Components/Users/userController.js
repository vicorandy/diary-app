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

    const token = user.createJWT({ userid: user.id, username: user.firstname });
    res.status(StatusCodes.CREATED);
    res.json({ message: 'user account was created successfully', user, token });
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
  try {
    // checking if all credentials are provided
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(StatusCodes.BAD_GATEWAY);
      res.json({ message: 'please enter your email and password' });
    }

    // fetching user
    const user = await User.findOne({ where: { email } });

    // if the user does not exist
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED);
      res.json({ message: 'invalid username or password' });
    }

    // comfirming if the user password is correct
    const hash = user.password;
    const isCorrect = await user.comparePassword(password, hash);
    if (!isCorrect) {
      res.status(StatusCodes.UNAUTHORIZED);
      res.json({ message: 'invalid username or password' });
    }

    // creating jsonwebtoken
    const token = user.createJWT({ userid: user.id, username: user.firstname });

    // sending final response to client
    res.status(StatusCodes.OK);
    res.json({ message: 'login was successful', user, token });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: 'Something went wrong' });
  }
}

async function deleteAccount(req, res) {
  res.send('delete acc');
}

module.exports = { signUp, signIn, deleteAccount };
