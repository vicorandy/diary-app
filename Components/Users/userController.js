const { StatusCodes } = require('http-status-codes');
const { sendEmail } = require('../../Utils/email');
const User = require('./userModel');

// FOR CREATING A USER ACCOUNT
// ////////////////////////////////////////////////////////////////////////////
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
// ////////////////////////////////////////////////////////////////////////////

// FOR LOGGING INTO A USER ACCOUNT
// ////////////////////////////////////////////////////////////////////////////
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
// ////////////////////////////////////////////////////////////////////////////

// FOR DELETING A USER ACCOUNT
// ////////////////////////////////////////////////////////////////////////////
async function deleteAccount(req, res) {
  res.send('delete acc');
}
// ////////////////////////////////////////////////////////////////////////////

// FORGOT PASSWORD
// ////////////////////////////////////////////////////////////////////////////
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND);
      res.json({ message: 'no user found with that email' });
    }
    if (user) {
      const verificationCode = user.createVerificationCode();
      const token = user.createJWT(
        { email, verificationCode },
        process.env.JWT_SECRETE
      );

      // send verificationcode to user email
      await sendEmail(verificationCode, user);
      res.status(StatusCodes.ACCEPTED);
      res.json({
        message: 'A verification code has been sent to your email',
        token,
        user,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: 'somthing went wromg' });
  }
}
// ////////////////////////////////////////////////////////////////////////////

// VERIFICATION FOR PASSWORD RESET
// ////////////////////////////////////////////////////////////////////////////
async function verificationForPasswordReset(req, res) {
  try {
    const { token, verificationCode } = req.body;
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });
    if (!user || !token || !verificationCode) {
      res.status(StatusCodes.UNAUTHORIZED);
      res.json({
        message:
          'Ensure all neccessary fields are provided with their correct credentials',
      });
      return;
    }
    const payLoad = user.verifyJWT(token);
    if (
      user.email === payLoad.email &&
      payLoad.verificationCode === verificationCode
    ) {
      const newToken = user.createJWT({ email: payLoad.email, isMatch: true });
      res.status(StatusCodes.OK);
      res.json({ newToken });
    } else {
      res.status(StatusCodes.UNAUTHORIZED);
      res.json({ message: 'invalid credentials' });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: 'Something went wrong' });
  }
}
// ////////////////////////////////////////////////////////////////////////////

// RESETTING USER PASSWORD
// ////////////////////////////////////////////////////////////////////////////
async function resetPassWord(req, res) {
  try {
    const { password, token } = req.body;
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });

    if (!user || !password || !token) {
      res.status(StatusCodes.UNAUTHORIZED);
      res.json({
        message:
          'Ensure all neccessary fields are provided with their correct credentials',
      });
    }
    const payLoad = user.verifyJWT(token);
    if (user.email === payLoad.email && payLoad.isMatch === true) {
      const hashPassword = await user.hashPassword(password);
      await User.update({ password: hashPassword }, { where: { id } });
      res.status(StatusCodes.OK);
      res.json({ message: 'you have successfully reset your password' });
    } else {
      res.status(StatusCodes.UNAUTHORIZED);
      res.json({ message: 'invalid credentials' });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: 'Something went wrong' });
  }
}
// ////////////////////////////////////////////////////////////////////////////

module.exports = {
  signUp,
  signIn,
  deleteAccount,
  forgotPassword,
  resetPassWord,
  verificationForPasswordReset,
};
