const Movie = require('../models/movie.model');


/* exports.validateBody = (req, res, next) => {

  if(!req.body.name || req.body.duration){
    return res.status(400).json({
      status: "fail",
      message: `Not a valid movie data!`
    });
  }

  next();
} */

exports.getAllMovies = async (req, res) => {
  try {
    console.log(req.query);
    const excludeFields = ['sort','page','limit','fields'];

    const queryObj = {...req.query};

    excludeFields.forEach((el) => {
      delete queryObj[el];
    });

    console.log(queryObj);

    const movies = await Movie.find(queryObj);

    res.status(200).json({
      status: 'success',
      length: movies.length,
      data: { movies }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
}

exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { movie }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}

exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if(movie) {
      res.status(200).json({
        status: 'success',
        data: { movie }
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'movie not found!'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}

exports.updateMovie = async (req, res) => {
  try {
    const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if(updateMovie) {
      res.status(200).json({
        status: 'success',
        data: { updateMovie }
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'movie not found!'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}

exports.deleteMovie = async (req, res) => {
  try {
    const deleteMovie = await Movie.findByIdAndDelete(req.params.id);

    if(deleteMovie) {
      res.status(200).json({
        status: 'success',
        data: { deleteMovie }
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'movie not found!'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}