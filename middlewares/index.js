const jwt = require('jsonwebtoken');
const { User } = require('../schemas/user/userMongooseSchema');
const { Unauthorized, NotFound } = require('http-errors');

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

module.exports = {
  auth,
};
