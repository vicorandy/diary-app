require('dotenv').config();
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../Utils/email');
const {
  passwordValidator,
  emailValidator,
} = require('../../Utils/stringValidator');
const User = require('./userModel');

// FOR CREATING A USER ACCOUNT
// ////////////////////////////////////////////////////////////////////////////
async function signUp(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;
    const isEmailCorrect = emailValidator(email);
    const isPasswordCorrect = passwordValidator(password);

    // validating user password
    if (!isEmailCorrect) {
      res.status(400);
      res.json({
        message: 'the email you entered appers to be miss the @ symbol',
      });
      return;
    }

    // validating password
    if (!isPasswordCorrect) {
      res.status(400);
      res.json({
        message:
          'make sure your password has at least one upper-case, lowercase, symbol, number, and is has a minimun of 8 characters in length example (AAbb12#$)',
      });
      return;
    }

    // checking if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(422);
      res.json({ message: 'A user with this email already exists' });
      return;
    }

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
    });

    const token = user.createJWT({
      userid: user.id,
      username: user.firstname,
      useremail: user.email,
    });

    // creating new object without password to send back to the user
    const data = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    res.status(201);
    res.json({
      message: 'user account was created successfully',
      user: data,
      token,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(401);
      res.json({
        message:
          'This email address has already been registered to an account. ',
      });
    } else {
      res.status(500);
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
      res.status(400);
      res.json({ message: 'please enter your email and password' });
    }

    // fetching user
    const user = await User.findOne({ where: { email } });

    // if the user does not exist
    if (!user) {
      res.status(404);
      res.json({ message: 'invalid username or password' });
    }

    // comfirming if the user password is correct
    const hash = user.password;
    const isCorrect = await user.comparePassword(password, hash);
    if (!isCorrect) {
      res.status(400);
      res.json({ message: 'invalid username or password' });
    }

    // creating jsonwebtoken
    const token = user.createJWT({
      userid: user.id,
      username: user.firstname,
      useremail: user.email,
    });

    // creating new object without password to send back to the user
    const data = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };
    // sending final response to client
    res.status(200);
    res.json({ message: 'login was successful', user: data, token });
  } catch (error) {
    res.status(500);
    res.json({ message: 'Something went wrong' });
  }
}
// ////////////////////////////////////////////////////////////////////////////

// FOR RETRIEVING USE INFO
// ////////////////////////////////////////////////////////////////////////////

async function getUserInfo(req, res) {
  try {
    const { token } = req.body;

    // checking for required input
    if (!token) {
      res.status(400);
      res.json({ message: 'please provide a token' });
      return;
    }

    // fetching user info
    const payLoad = jwt.verify(token, process.env.JWT_SECRETE);

    // sending user info
    if (payLoad) {
      res.status(200);
      res.json({ message: 'your request was successful', userInfo: payLoad });
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(400);
      res.json({ message: 'invalid token' });
    }
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
      res.status(404);
      res.json({ message: 'no user found with that email' });
      return;
    }
    if (user) {
      const verificationCode = user.createVerificationCode();
      const token = user.createJWT(
        { email, verificationCode },
        process.env.JWT_SECRETE
      );

      // send verificationcode to user email
      await sendEmail(verificationCode, user);
      delete user.password;
      res.status(202);
      res.json({
        message: 'A verification code has been sent to your email',
        token,
        user,
      });
    }
  } catch (error) {
    res.status(500);
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
      res.status(401);
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
      res.status(200);
      res.json({ newToken });
    } else {
      res.status(401);
      res.json({ message: 'invalid credentials' });
    }
  } catch (error) {
    res.status(500);
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
      res.status(401);
      res.json({
        message:
          'Ensure all neccessary fields are provided with their correct credentials',
      });
    }
    const payLoad = user.verifyJWT(token);
    if (user.email === payLoad.email && payLoad.isMatch === true) {
      const hashPassword = await user.hashPassword(password);
      await User.update({ password: hashPassword }, { where: { id } });
      res.status(200);
      res.json({ message: 'you have successfully reset your password' });
    } else {
      res.status(401);
      res.json({ message: 'invalid credentials' });
    }
  } catch (error) {
    res.status(500);
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
  getUserInfo,
};
