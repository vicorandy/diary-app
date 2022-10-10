const express = require('express');
const { signUp, signIn, deleteAccount } = require('./userController');

const userRouter = express.Router();

userRouter.route('/signup').post(signUp);
userRouter.route('/signin').post(signIn);
userRouter.route('/delete_account').delete(deleteAccount);

module.exports = userRouter;
