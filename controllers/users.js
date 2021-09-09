require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const NotFoundError = require('../utils/not-found-error');
const UnauthorizedClientError = require('../utils/unauthorized-client-error');

const { NODE_ENV, JWT_SECRET } = process.env;
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name, email: user.email,
    }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedClientError('Неправильный пользователь или пароль');

      bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (!isValid) throw new UnauthorizedClientError('Неправильный логин или пароль');

          if (isValid) {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
              { expiresIn: '7d' },
            );
            res.cookie('jwt', token, {
              httpOnly: true,
              sameSite: true,
            }).send({
              name: user.name, email: user.email,
            });
          }
        })
        .catch(next);
    })
    .catch(next);
};
// eslint-disable-next-line no-unused-vars
const logout = (req, res, next) => {
  res.cookie('jwt', 'jwt.token.revoked', {
    httpOnly: true,
    sameSite: true,
    maxAge: -1,
  }).send({
    message: 'Сессия была успешно завершена',
  });
};

module.exports = {
  createUser,
  login,
  logout,
};
