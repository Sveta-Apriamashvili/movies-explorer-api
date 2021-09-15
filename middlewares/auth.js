require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedClientError = require('../utils/unauthorized-client-error');

const { NODE_ENV, JWT_SECRET } = process.env;
const UNAUTHORIZED_ERROR_MESSAGE = 'Необходима авторизация';

const auth = (req, res, next) => {
  if (!req.cookies.jwt) throw new UnauthorizedClientError(UNAUTHORIZED_ERROR_MESSAGE);

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    throw new UnauthorizedClientError(UNAUTHORIZED_ERROR_MESSAGE);
  }

  req.user = payload;
  console.log(`User ID: ${req.user}`);

  next();
};

module.exports = auth;
