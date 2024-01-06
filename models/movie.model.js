const mongoose = require('mongoose');

//Creando un esquema para mongodb
const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name is required field!'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    require: [true, 'Description is required field!'],
    trim: true
  },
  duration: {
    type: Number,
    require: [true, 'Duration is required field!']
  },
  ratings: {
    type: Number
  },
  totalRating: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    require: [true, 'Release year is required field!']
  },
  releaseDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  genres: {
    type: [String],
    require: [true, 'Genres is required field!']
  },
  directors: {
    type: [String],
    require: [true, 'Directors is required field!']
  },
  coverImage: {
    type: String,
    require: [true, 'Cover image is required field!']
  },
  actors: {
    type: [String],
    require: [true, 'Actors is required field!']
  },
  price: {
    type: Number,
    require: [true, 'Price is required field!']
  }
});

//Creando el modelo a partir del esquema
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;