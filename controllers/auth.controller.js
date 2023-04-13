const { User } = require('../schemas/user/userMongooseSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const { nanoid } = require('nanoid');
const Jimp = require('jimp');
const path = require('path');
const sgMail = require('@sendgrid/mail');

const {
  BadRequest,
  Unauthorized,
  NotFound,
  Conflict,
} = require('../helpers/errors');
const {
  registerSchema,
  loginSchema,
  subscriptionUpdateSchema,
  resendValidationSchema,
} = require('../schemas/user/userJoiSchema');

const { JWT_SECRET, SENDGRID_API_KEY, SENDGRID_EMAIL } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const register = async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }
  const { email, password,name } = req.body;

  try {
    const verificationToken = nanoid();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const { subscription, avatarURL } = await User.create({
      email,
      password: hashedPassword,
      name,
      avatarURL: gravatar.url(email, { protocol: 'http', s: '250' }),
      verificationToken,
    });

    const msg = {
      to: email,
      from: SENDGRID_EMAIL,
      subject: 'Please, confirm your email',
      text: `Please, confirm your email by link http://localhost:3000/api/users/verify/${verificationToken} `,
      html: `<b>Please, confirm your email by <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a> </b>`,
    };

    await sgMail.send(msg);

    res.status(201).json({ user: { name, email, subscription, avatar: avatarURL } });
  } catch (error) {
    if (error.code === 11000) {
      next(new Conflict('User with this email already exists!'));
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }
  const { email, password } = req.body;
  try {
    const storedUser = await User.findOne({ email });

    if (!storedUser) {
      throw new BadRequest(`User with email ${email} not found`);
    }
    if (!storedUser.verify) {
      throw new Unauthorized(
        'Email is not verified! Please check your mail box.'
      );
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
        name: storedUser.name,
        avatar: storedUser.avatarURL,
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
    const { email, subscription, avatarURL, name } = req.user;
    res.json({ email, subscription, avatar: avatarURL, name });
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
    res.json( { avatar: user.avatarURL } );
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw new NotFound('User not found');
    }
    user.verificationToken = null;
    user.verify = true;
    user.save();

    return res.json({ message: 'Verification successful' });
  } catch (error) {
    next(error);
  }
};

const resendEmail = async (req, res, next) => {
  const { error } = resendValidationSchema.validate(req.body);
  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }

  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFound('User not found');
    }

    if (user.verify) {
      throw new BadRequest('Verification has already been passed');
    }
    const msg = {
      to: email,
      from: SENDGRID_EMAIL,
      subject: 'Please, confirm your email',
      text: `Please, confirm your email by link http://localhost:3000/api/users/verify/${user.verificationToken} `,
      html: `<b>Please, confirm your email by <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a> </b>`,
    };

    await sgMail.send(msg);

    return res.json({ message: 'Verification email sent' });
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
  verifyEmail,
  resendEmail,
};
