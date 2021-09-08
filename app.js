const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const {
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();
const corsOptions = {
  origin: 'http://example.com',
  credentials: true,
};
app.use(cookieParser());
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(express.json());
app.use(cors(corsOptions));
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
