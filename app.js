const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const {
  createUser,
  login,
  logout,
} = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./utils/not-found-error');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const { PORT = 3000 } = process.env;
const {DB_NAME = 'cockatoo'} = process.env;

const app = express();
const auth = require('./middlewares/auth');

const corsOptions = {
  origin: ['https://study.movies.nomoredomains.club',
    'http://study.movies.nomoredomains.club',
    'localhost:3000',
    'http://localhost:3000'],
  credentials: true,
};
const errorsHandler = require('./middlewares/error');

app.use(helmet());
app.use(cookieParser());
mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(express.json());
app.use(cors(corsOptions));
app.use(requestLogger);

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

app.use(auth);

app.use('/', userRouter);
app.use('/', movieRouter);

// eslint-disable-next-line no-unused-vars
app.use((req, res) => {
  throw new NotFoundError('Запрашиваемый метод не существует');
});

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
