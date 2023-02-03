const express = require('express');

const {
  register,
  login,
  logout,
  currentUser,
  subscriptionUpdate,
  updateAvatar,
  verifyEmail,
  resendEmail,
} = require('../../controllers/auth.controller');
const { auth, upload } = require('../../middlewares');

const authRouter = express.Router();

authRouter.patch('/', auth, subscriptionUpdate);

authRouter.post('/register', register);
authRouter.get('/verify/:verificationToken', verifyEmail);
authRouter.post('/verify', resendEmail);
authRouter.post('/login', login);

authRouter.post('/logout', auth, logout);

authRouter.get('/current', auth, currentUser);

authRouter.patch('/avatars', auth, upload.single('avatar'), updateAvatar);

module.exports = { authRouter };
