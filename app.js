const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index')
const limiter = require('./middlewares/rate-limiter')

const { PORT = 3000 } = process.env;
const {DB_NAME = 'moviesdb_dev'} = process.env;

const app = express();
const auth = require('./middlewares/auth');

limiter.handleRateLimit(app);

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
  useUnifiedTopology: true,
});
app.use(express.json());
app.use(cors(corsOptions));
app.use(requestLogger);

router.handleRouting(app, auth);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
