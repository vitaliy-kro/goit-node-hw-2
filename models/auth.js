const { User } = require('../schemas/user/userMongooseSchema');
const bcrypt = require('bcrypt');

const register = async ({ email, password }) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const registeredUser = await User.create({ email, password: hashedPassword });
  return registeredUser;
};

const login = async ({ email, password }) => {
  const storedUser = await User.findOne({ email });
  if (!storedUser) {
    return storedUser;
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!isPasswordValid) {
    return isPasswordValid;
  }

  return storedUser;
};

const subscriptionUpdate = async (id, body) => {
  const result = await User.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  );
  return result;
};
module.exports = { register, login, subscriptionUpdate };
