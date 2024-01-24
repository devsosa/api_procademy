const Movie = require('../models/movie.model');
const Apifeatures = require('../utils/api.features');
const asyncErrorHandler = require('../utils/async.error.handler');
const CustomError = require('../utils/custom.error');


/* exports.validateBody = (req, res, next) => {

  if(!req.body.name || req.body.duration){
    return res.status(400).json({
      status: "fail",
      message: `Not a valid movie data!`
    });
  }

  next();
} */

//http://localhost:3000/api/v1/movies/highest-rated
exports.getHighestRated = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings'

  next();
}

exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {
  
  const features = new Apifeatures(Movie.find(), req.query)
                      .filter()
                      .sort()
                      .limit()
                      .paginate();
  
  let movies = await features.query;
  
  res.status(200).json({
    status: 'success',
    length: movies.length,
    data: { movies }
  });
  /* try {
    const features = new Apifeatures(Movie.find(), req.query)
                      .filter()
                      .sort()
                      .limit()
                      .paginate();

    //let movies = features
    movies = await features.query;
    //console.log(req.query);
    const excludeFields = ['sort','page','limit','fields']; */

    //const queryObj1 = {...req.query};

    /* excludeFields.forEach((el) => {
      delete queryObj[el];
    }); */
    

    //Filtro avanzado
    //objeto obtenido por la peticion get
    /* {
      duration: { gte: '90' },
      ratings: { gte: '5' },
      price: { lte: '100' }
    } */

    //Objeto que se debe pasar
    // find({duration: {$gte: 90}, ratings: {$gte: 5}, price: {$lte: 100}})

    
    //Usando otros metodos de mongo
    /* const movies = await Movie.find()
    .where('duration')
    .gte(req.query.duration)
    .where('ratings')
    .gte(req.query.ratings)
    .where('price')
    .gte(req.query.price); */
    
    //const movies = await query;
    //console.log(movies);
    /* res.status(200).json({
      status: 'success',
      length: movies.length,
      data: { movies }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  } */
});

exports.createMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { movie }
  });
  /* try {
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
  } */
});

exports.getMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if(movie) {
    res.status(200).json({
      status: 'success',
      data: { movie }
    });
  } else {
    const error = new CustomError('Movie with that ID is not found', 404);
    next(error);
    // console.log(error.message);
    // return next(error);
    /* res.status(404).json({
      status: 'fail',
      message: 'movie not found!'
    }); */
  }
  /* try {
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
      status: 'fail2',
      message: error.message
    });
  } */
});

exports.updateMovie = asyncErrorHandler(async (req, res, next) => {
  const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

  if(updateMovie) {
    res.status(200).json({
      status: 'success',
      data: { updateMovie }
    });
  } else {
    const error = new CustomError('Movie with that ID is not found', 404);
    next(error);
  }
  /* try {
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
  } */
});

exports.deleteMovie = asyncErrorHandler(async (req, res, next) => {
  const deleteMovie = await Movie.findByIdAndDelete(req.params.id);

  if(deleteMovie) {
    res.status(200).json({
      status: 'success',
      data: { deleteMovie }
    });
  } else {
    const error = new CustomError('Movie with that ID is not found', 404);
    next(error);
  }
  /* try {
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
  } */
});

exports.getMovieStats = asyncErrorHandler(async (req, res, next) => {
  const stats = await Movie.aggregate([
    { $match: { ratings: {$gte: 4.5} } },
    { $group: {
        _id: '$releaseYear',
        avgRating: {$avg: '$ratings'},
        avgPrice: {$avg: '$price'},
        minPrice: {$min: '$price'},
        maxPrice: {$max: '$price'},
        totalPrice: {$sum: '$price'},
        movieCount: {$sum: 1},
      }
    },
    { $sort: {minPrice: 1}},
    //{ $match: { maxPrice: {$gte: 60} } },

  ]);

  res.status(200).json({
    status: 'success',
    count: stats.length,
    data: { stats }
  });
  /* try {
    const stats = await Movie.aggregate([
      { $match: { ratings: {$gte: 4.5} } },
      { $group: {
          _id: '$releaseYear',
          avgRating: {$avg: '$ratings'},
          avgPrice: {$avg: '$price'},
          minPrice: {$min: '$price'},
          maxPrice: {$max: '$price'},
          totalPrice: {$sum: '$price'},
          movieCount: {$sum: 1},
        }
      },
      { $sort: {minPrice: 1}},
      //{ $match: { maxPrice: {$gte: 60} } },

    ]);

    res.status(200).json({
      status: 'success',
      count: stats.length,
      data: { stats }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  } */
});

exports.getMovieByGenre = asyncErrorHandler(async (req, res) => {
  const genre =  req.params.genre;
  const movies = await Movie.aggregate([
    { $unwind: '$genres' },
    { $group: {
      _id: '$genres',
      movieCount: { '$sum': 1 },
      movies: { '$push': '$name' }
    }},
    { $addFields: { genre: '$_id' }},
    { $project: { _id: 0 }},
    { $sort: { movieCount: -1 }},
    //{ $limit: 6 },
    { $match: { genre:genre }},

  ]);

  res.status(200).json({
    status: 'success',
    count: movies.length,
    data: { movies }
  });
  /* try {
    const genre =  req.params.genre;
    const movies = await Movie.aggregate([
      { $unwind: '$genres' },
      { $group: {
        _id: '$genres',
        movieCount: { '$sum': 1 },
        movies: { '$push': '$name' }
      }},
      { $addFields: { genre: '$_id' }},
      { $project: { _id: 0 }},
      { $sort: { movieCount: -1 }},
      //{ $limit: 6 },
      { $match: { genre:genre }},

    ]);

    res.status(200).json({
      status: 'success',
      count: movies.length,
      data: { movies }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  } */
});