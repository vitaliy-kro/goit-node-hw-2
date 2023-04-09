const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
      name: {
          type: String,
          required: [true, "Name is required"]
      },
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: String,
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model('user', schema);

module.exports = {
  User,
};
