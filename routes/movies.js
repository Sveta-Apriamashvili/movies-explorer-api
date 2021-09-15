const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  handleCreateMovieValidation,
  handleDeleteMovieValidation,
} = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', handleCreateMovieValidation, createMovie);
router.delete('/movies/:movieId', handleDeleteMovieValidation, deleteMovie);

module.exports = router;
