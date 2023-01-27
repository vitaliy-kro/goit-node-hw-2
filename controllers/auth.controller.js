const { User } = require('../schemas/user/userMongooseSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const path = require('path');
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

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const { subscription, avatarURL } = await User.create({
      email,
      password: hashedPassword,
      avatarURL: gravatar.url(email, { protocol: 'http', s: '250' }),
    });

    res.status(201).json({ user: { email, subscription, avatarURL } });
  } catch (error) {
    if (error.code === 11000) {
      next(new Conflict('User with this email already exists!'));
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

    return res.json({
      token,
      user: {
        email: storedUser.email,
        subscription: storedUser.subscription,
      },
    });
  } catch (error) {
    next(error);
    return error;
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

const updateAvatar = async (req, res, next) => {
  const { filename } = req.file;

  const tmpPath = path.resolve(__dirname, '../tmp', filename);
  const publicPath = path.resolve(__dirname, '../public/avatars', filename);

  try {
    await Jimp.read(tmpPath)
      .then(img => {
        return img.resize(250, 250).write(publicPath);
      })
      .catch(err => {
        throw new BadRequest(err.message);
      });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: `/api/avatars/${filename} `,
      },
      { new: true }
    );
    res.json({ data: { avatarURL: user.avatarURL } });
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
  updateAvatar,
};
