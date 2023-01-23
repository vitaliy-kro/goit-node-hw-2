const express = require('express');
const { Conflict, Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const {
  register,
  login,
  logout,
  currentUser,
  subscriptionUpdate,
} = require('../../controllers/auth.controller');
const { tryCatchWrapper } = require('../../helpers');
const { auth } = require('../../middlewares');

const authRouter = express.Router();

authRouter.patch('/', auth, subscriptionUpdate);

authRouter.post('/register', register);
authRouter.post('/login', login);

authRouter.post('/logout', auth, logout);

authRouter.get('/current', auth, currentUser);

module.exports = { authRouter };
