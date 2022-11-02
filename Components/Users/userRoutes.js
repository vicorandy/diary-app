const express = require('express');
const {
  signUp,
  signIn,
  deleteAccount,
  forgotPassword,
  verificationForPasswordReset,
  resetPassWord,
  getUserInfo,
} = require('./userController');

const userRouter = express.Router();

userRouter.route('/signup').post(signUp);
userRouter.route('/signin').post(signIn);
userRouter.route('/forgot_passsword').post(forgotPassword);
userRouter.route('/verification_code').post(verificationForPasswordReset);
userRouter.route('/reset_password').patch(resetPassWord);
userRouter.route('/delete_account').delete(deleteAccount);
userRouter.route('/get_user_info').post(getUserInfo);

module.exports = userRouter;
