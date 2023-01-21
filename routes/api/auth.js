const express = require('express');
const { Conflict, Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const { auth } = require('../../middlewares');
const { register, login, subscriptionUpdate } = require('../../models/auth');
const {
  authSchema,
  subscriptionUpdateSchema,
} = require('../../schemas/user/userJoiSchema');

const authRouter = express.Router();

const { JWT_SECRET } = process.env;

authRouter.patch('/', async (req, res, next) => {
  const { body } = req;
  const { error } = subscriptionUpdateSchema.validate(body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const authCheck = await auth(req);
    req.user = authCheck;
    if (
      !authCheck ||
      authCheck === 'token type is not valid' ||
      authCheck === 'no token provided' ||
      authCheck === 'jwt expired'
    ) {
      throw Unauthorized(authCheck || 'You are not logged in');
    }
    const { _id, name, email, subscription } = await subscriptionUpdate(
      req.user.id,
      body
    );
    res.json({ id: _id, name, email, subscription });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/register', async (req, res, next) => {
  const { body } = req;
  const { error } = authSchema.validate(body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const { email, subscription } = await register(body);
    res.status(201).json({ user: { email, subscription } });
  } catch (error) {
    if (error.code === 11000) {
      next(Conflict('User with this email already exists!'));
    }
    next(error);
  }
});
authRouter.post('/login', async (req, res, next) => {
  const { body } = req;
  const { error } = authSchema.validate(body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const loggedInUser = await login(body);
    if (!loggedInUser) {
      throw Unauthorized('Email or password is wrong');
    }
    const payload = { id: loggedInUser._id };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        email: loggedInUser.email,
        subscription: loggedInUser.subscription,
      },
    });
  } catch (error) {
    if (error.message === 11000) {
      next(Conflict('User with this email already exists!'));
    }
    next(error);
  }
});

authRouter.post('/logout', async (req, res, next) => {
  try {
    const authCheck = await auth(req);

    if (!authCheck) {
      throw Unauthorized('You are not logged in');
    }
    req.headers.authorization = '';

    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

authRouter.get('/current', async (req, res, next) => {
  try {
    const authCheck = await auth(req);

    if (
      !authCheck ||
      authCheck === 'token type is not valid' ||
      authCheck === 'no token provided' ||
      authCheck === 'jwt expired'
    ) {
      throw Unauthorized(authCheck || 'You are not logged in');
    }

    res.json({ email: authCheck.email, subscription: authCheck.subscription });
  } catch (error) {
    next(error);
  }
});

module.exports = { authRouter };
