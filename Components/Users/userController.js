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
      res.status(409);
      res.json({
        message:
          'This email address has already been registered to an account.',
      });
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

    // deleting hashed password
    delete user.dataValues.password;

    res.status(201);
    res.json({
      message: 'user account was created successfully',
      user,
      token,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409);
      res.json({
        message:
          'This email address has already been registered to an account.',
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
      return;
    }

    // fetching user
    const user = await User.findOne({ where: { email } });

    // if the user does not exist
    if (!user) {
      res.status(404);
      res.json({ message: 'invalid email or password' });
      return;
    }

    // comfirming if the user password is correct
    const hash = user.password;
    const isCorrect = await user.comparePassword(password, hash);
    if (!isCorrect) {
      res.status(400);
      res.json({ message: 'invalid email or password' });
    }

    // creating jsonwebtoken
    const token = user.createJWT({
      userid: user.id,
      username: user.firstname,
      useremail: user.email,
    });

    // deleting hashed password
    delete user.dataValues.password;

    // sending final response to client
    res.status(200);
    res.json({ message: 'login was successful', user, token });
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
  const { email, password } = req.body;

  // checking for required input
  if (!email || !password) {
    res.status(400);
    res.json({
      message: 'please provide all required feilds (email and passsword)',
    });
    return;
  }

  // fetching user
  const user = await User.findOne({ where: { email } });

  // if the user does not exist
  if (!user) {
    res.status(404);
    res.json({ message: 'no user with that email' });
    return;
  }

  // comfirming if the user password is correct
  const hash = user.password;
  const isCorrect = await user.comparePassword(password, hash);
  if (!isCorrect) {
    res.status(401);
    res.json({ message: 'you are not authorized to delete this account' });
    return;
  }
  if (isCorrect) {
    await User.destroy({ where: { email } });
    res.status(200);
    res.json({ message: 'you have successfully closed your account.' });
  }
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
        { user, verificationCode },
        process.env.JWT_SECRETE
      );

      // send verificationcode to user email
      await sendEmail(verificationCode, user);

      res.status(202);
      res.json({
        message: 'A verification code has been sent to your email',
        token,
        verificationcodelink: {
          href: 'https://localhost3000/api/v1/users/verification_code',
        },
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
    const payLoad = jwt.verify(token, process.env.JWT_SECRETE);
    const { user } = payLoad;

    // making sure all fields are provided
    if (!user || !token || !verificationCode) {
      res.status(401);
      res.json({
        message:
          'Ensure all neccessary fields are provided with their correct credentials',
      });
      return;
    }

    // checking if the verifaction code sent by the user is correct
    if (verificationCode === payLoad.verificationCode) {
      const newToken = jwt.sign(
        { user, isMatch: true },
        process.env.JWT_SECRETE
      );
      res.status(200);
      res.json({
        token: newToken,
        resetpassword: {
          href: 'https://localhost3000/api/v1/users/reset_password',
        },
      });
    } else {
      res.status(401);
      res.json({ message: 'invalid token' });
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
    const { token, password } = req.body;
    const payLoad = jwt.verify(token, process.env.JWT_SECRETE);
    const { user } = payLoad;
    const isPasswordCorrect = passwordValidator(password);

    // making sure all fields are provided
    if (!token || !password) {
      res.status(404);
      res.json({
        message:
          'Ensure all neccessary fields are provided with their correct credentials',
      });
    }

    // checking if password is in a valid format
    if (!isPasswordCorrect) {
      res.status(400);
      res.json({
        message:
          'make sure your password has at least one upper-case, lowercase, symbol, number, and is has a minimun of 8 characters in length example (AAbb12#$)',
      });
      return;
    }

    // checking if token is valid
    if (!user) {
      res.status(401);
      res.json({ message: 'invalid token' });
      return;
    }

    // resetting user password
    if (payLoad.isMatch === true) {
      const { id } = user;
      const newUser = await User.findOne({ where: { id } });
      const hashPassword = await newUser.hashPassword(password);
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
