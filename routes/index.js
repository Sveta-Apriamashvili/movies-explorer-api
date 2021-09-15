const userRouter = require('./users');
const movieRouter = require('./movies');
const {
  createUser,
  login,
  logout,
} = require('../controllers/users');
const NotFoundError = require('../utils/not-found-error');
const {
  handleSignUpValidation,
  handleSignInValidation,
} = require('../middlewares/validation');

const handleRouting = (app, auth) => {
  app.post('/signup', handleSignUpValidation, createUser);
  app.post('/signin', handleSignInValidation, login);
  app.post('/signout', logout);

  app.use(auth);

  app.use('/', userRouter);
  app.use('/', movieRouter);

  // eslint-disable-next-line no-unused-vars
  app.use((req, res) => {
    throw new NotFoundError('Запрашиваемый метод не существует');
  });
};

module.exports = {
  handleRouting,
};
