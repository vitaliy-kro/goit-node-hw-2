const jwt = require('jsonwebtoken');
const { User } = require('../schemas/user/userMongooseSchema');
const { Unauthorized, NotFound } = require('../helpers/errors');
const multer = require('multer');
const path = require('path');

const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');
  try {
    if (type !== 'Bearer') {
      throw new Unauthorized('token type is not valid');
    }

    if (!token) {
      throw new Unauthorized("no token provided'");
    }

    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(id);
    if (!user) {
      throw new NotFound(`user with id: ${id} not found`);
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      next(new Unauthorized('jwt token is not valid'));
    }
    next(error);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../tmp'));
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + file.originalname);
  },
});

const upload = multer({
  storage,
});

module.exports = {
  auth,
  upload,
};
