const express = require('express');
const moviesController = require('../controllers/movies.controller');

const router = express.Router();

//router.param('id', moviesController.checkId);

//Obtener lae¿s mejores peliculas
router.route('/highest-rated').get(moviesController.getHighestRated, moviesController.getAllMovies);

router.route('/movie-stats').get(moviesController.getMovieStats);
router.route('/movies-by-genre/:genre').get(moviesController.getMovieByGenre);

router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.createMovie);

router.route('/:id')
    .get(moviesController.getMovie)
    .put(moviesController.updateMovie)
    .delete(moviesController.deleteMovie);

module.exports= router;

// Route = HTTP METHOD + URL
/* app.get('/', (req, res) => {
  //res.status(200).send('<h3>Hello from express server!><hr>');
  res.status(200).json({msg: 'json desde express', status: 200});
}); */

/* // GET - api/v1/movies
app.get('/api/v1/movies', getAllMovies);

// POST - api/v1/movies
app.post('/api/v1/movies', createMovie);

// GET - api/v1/movies/id -- with parameters
app.get('/api/v1/movies/:id', getMovie);

// PUT | PATCH - api/v1/movies/id
app.put('/api/v1/movies/:id', updateMovie);

// DELETE - /api/v1/movies/:id
app.delete('/api/v1/movies/:id', deleteMovie); */


/* OTRA FORMA DE DEFINIR LAS RUTAS */
/* moviesRouter.route('/')
    .get(getAllMovies)
    .post(createMovie);

moviesRouter.route('/:id')
    .get(getMovie)
    .put(updateMovie)
    .delete(deleteMovie); */