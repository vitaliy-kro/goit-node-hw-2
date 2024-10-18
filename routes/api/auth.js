const express = require('express');

const {
  register,
  login,
  logout,
  currentUser,
  subscriptionUpdate,
  updateAvatar,
} = require('../../controllers/auth.controller');
const { auth, upload, uploadImageToCloudinary } = require('../../middlewares');

const authRouter = express.Router();

authRouter.patch('/', auth, subscriptionUpdate);

authRouter.post('/register', register);
authRouter.post('/login', login);

authRouter.post('/logout', auth, logout);

authRouter.get('/current', auth, currentUser);

authRouter.patch(
  '/avatars',
  auth,
  upload.single('avatar'),
  uploadImageToCloudinary,
  updateAvatar
);

module.exports = { authRouter };
