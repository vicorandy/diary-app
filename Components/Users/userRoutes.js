const express = require('express');
const {
  signUp,
  signIn,
  deleteAccount,
  forgotPassword,
  verificationForPasswordReset,
  resetPassWord,
} = require('./userController');

const userRouter = express.Router();

userRouter.route('/signup').post(signUp);
userRouter.route('/signin').post(signIn);
userRouter.route('/forgot_passsword').post(forgotPassword);
userRouter.route('/verification_code/:id').post(verificationForPasswordReset);
userRouter.route('/reset_password/:id').patch(resetPassWord);
userRouter.route('/delete_account').delete(deleteAccount);

module.exports = userRouter;
