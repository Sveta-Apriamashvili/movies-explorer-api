const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const {
  createUser,
  login,
  logout,
} = require('../controllers/users');

const _unprotectedRoutes = (app) => {
  app.post('/signup', celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), createUser);
  app.post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), login);
  app.post('/signout', logout);
}

const _protectedRoutes = (app) => {
  app.use('/', userRouter);
  app.use('/', movieRouter);
}

const _undefinedRote = (app) => {
  // eslint-disable-next-line no-unused-vars
  app.use((req, res) => {
    throw new NotFoundError('Запрашиваемый метод не существует');
  });
}

const handleRouting = (app, auth) => {
  _unprotectedRoutes(app);
  app.use(auth);
  _protectedRoutes(app);
  _undefinedRote(app);
};

module.exports = {
  handleRouting,
};