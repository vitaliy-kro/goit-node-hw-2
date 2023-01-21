const jwt = require('jsonwebtoken');
const { User } = require('../schemas/user/userMongooseSchema');

const { JWT_SECRET } = process.env;

async function auth(req) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer') {
    return 'token type is not valid';
  }

  if (!token) {
    return 'no token provided';
  }

  const { id } = jwt.verify(token, JWT_SECRET);

  const user = await User.findById(id);

  return user;
}

module.exports = {
  auth,
};
