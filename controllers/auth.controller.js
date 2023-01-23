const { User } = require('../schemas/user/userMongooseSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Conflict, Unauthorized, BadRequest } = require('http-errors');
const {
  authSchema,
  subscriptionUpdateSchema,
} = require('../schemas/user/userJoiSchema');

const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
  const { error } = authSchema.validate(req.body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }
  const { email, password } = req.body;
  console.log('email', email);

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const { subscription } = await User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({ user: { email, subscription } });
  } catch (error) {
    if (error.code === 11000) {
      next(Conflict('User with this email already exists!'));
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  const { error } = authSchema.validate(req.body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }
  const { email, password } = req.body;
  try {
    const storedUser = await User.findOne({ email });
    if (!storedUser) {
      throw new BadRequest(`User with email ${email} not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, storedUser.password);

    if (!isPasswordValid) {
      throw new Unauthorized('Email or password is wrong');
    }
    const payload = { id: storedUser._id };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        email: storedUser.email,
        subscription: storedUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    req.headers.authorization = '';

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const subscriptionUpdate = async (req, res, next) => {
  const { error } = subscriptionUpdateSchema.validate(req.body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const { _id, name, email, subscription } = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    );
    res.json({ id: _id, name, email, subscription });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  currentUser,
  subscriptionUpdate,
};
