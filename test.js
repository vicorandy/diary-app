// const { token, verificationCode } = req.body;
// const { id } = req.params;

// const user = await User.findOne({ where: { id } });
// if (!user || !token || !verificationCode) {
//   res.status(401);
//   res.json({
//     message:
//       'Ensure all neccessary fields are provided with their correct credentials',
//   });
//   return;
// }
// const payLoad = user.verifyJWT(token);
// if (
//   user.email === payLoad.email &&
//   payLoad.verificationCode === verificationCode
// ) {
//   const newToken = user.createJWT({ email: payLoad.email, isMatch: true });
//   res.status(200);
//   res.json({ newToken });
// } else {
//   res.status(401);
//   res.json({ message: 'invalid credentials' });
// }

// ///////////////////////////////

// const { password, token } = req.body;
// const { id } = req.params;
// const user = await User.findOne({ where: { id } });

// if (!user || !password || !token) {
//   res.status(401);
//   res.json({
//     message:
//       'Ensure all neccessary fields are provided with their correct credentials',
//   });
// }
// const payLoad = user.verifyJWT(token);
// if (user.email === payLoad.email && payLoad.isMatch === true) {
//   const hashPassword = await user.hashPassword(password);
//   await User.update({ password: hashPassword }, { where: { id } });
//   res.status(200);
//   res.json({ message: 'you have successfully reset your password' });
// } else {
//   res.status(401);
//   res.json({ message: 'invalid credentials' });
// }
