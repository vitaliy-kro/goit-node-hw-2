require('dotenv').config();
const bcrypt = require('bcrypt');

const httpMocks = require('node-mocks-http');

const { login } = require('../controllers/auth.controller');
const { User } = require('../schemas/user/userMongooseSchema');

describe('Auth Service login test', () => {
  const email = 'qwe@mail.com';
  const password = '123';
  const mReq = {
    body: {
      email,
      password,
    },
  };
  const mNext = jest.fn();

  beforeAll(async () => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = {
      _id: '12345',
      email,
      password: hashedPassword,
      subscription: 'pro',
    };

    jest.spyOn(User, 'findOne').mockImplementation(async () => user);
  });

  it('should return success status-code', async () => {
    const mRes = httpMocks.createResponse();

    const result = await login(mReq, mRes, mNext);

    expect(result.statusCode).toBe(200);
  });

  it('should return token', async () => {
    const mRes = httpMocks.createResponse();

    const result = await login(mReq, mRes, mNext);
    const { token } = JSON.parse(result._getData());

    expect(token).not.toBe(undefined);
  });

  it('should return obj with password and subscription with string type', async () => {
    const mRes = httpMocks.createResponse();

    const result = await login(mReq, mRes, mNext);
    const { user } = JSON.parse(result._getData());

    expect(user).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        subscription: expect.any(String),
      })
    );
  });
});
