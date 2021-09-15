const Movie = require('../models/movie');
const NotFoundError = require('../utils/not-found-error');
const ForbiddenError = require('../utils/forbidden-error');

const getMovies = (req, res, next) => {
  Movie.find({})
    .sort({ createdAt: 'desc' })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    // eslint-disable-next-line max-len
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  return Movie.create({
    // eslint-disable-next-line max-len
    country, director, duration, year, description, image, trailer, nameRU, nameEN, owner, thumbnail, movieId,
  })
    .then((movie) => res.send(movie))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError('Карточки не существует');
      if (movie.owner.toString() !== req.user._id.toString()) throw new ForbiddenError('Нельзя удалять карточки других пользователей');

      return movie.delete()
        .then((c) => res.send(c))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
