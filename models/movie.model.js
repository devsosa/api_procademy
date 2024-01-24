const mongoose = require('mongoose');
const fs = require('fs');
const validator = require('validator');

//Creando un esquema para mongodb
const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name is required field!'],
    unique: [true, 'The Name is unique!'],
    maxlength: [100, 'Movie name must not have more than 100 characters'],
    minlength: [4, 'Movie name must have at leas 4 characters'],
    trim: true,
    validate: [validator.isAlpha, 'Name should only contain alphabets.']
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
    type: Number,
    // min: [1, 'Ratings must be 1.0 or above.'],
    // max: [10, 'Ratings must be 10 or below.']
    // custom validator
    validate: {
      validator: function (value) {
        return value >= 1 && value <= 10;
      },
      message: "Ratings ({VALUE}) should be above 1 and below 10"
    }
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
    default: Date.now(),
    //permite excluir el campo de todas las consultas
    //select: false 
  },
  genres: {
    type: [String],
    require: [true, 'Genres is required field!'],
    enum: {
      values: ['Action','Adventure','Sci-Fi','Thriller','Crime','Drama','Comedy','Romance','Biography'],
      message: 'This genre does not exist'
    }
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
  },
  createdBy: {
    type: String,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// VIRTUAL PROPERTIES MONGOOSE
movieSchema.virtual('durationInHours').get(function() {
  return this.duration / 60;
});

// MIDDLEWARE MONGOOSE
movieSchema.pre('save', function(next) {
  this.createdBy = 'carlitox';
  //console.log(this);
  next();
});

movieSchema.post('save', function(doc, next) {
  const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;
  fs.writeFileSync('./log/log.txt', content, {flag: 'a'}, (err) => {
    console.log(err.message);
  });

  next();
});

// QUERY MIDDLEWARE
// se usa la exresion regua /^find/ para incluir todos los metodos que inicien con find
movieSchema.pre(/^find/, function (next) {
  // this apunta al objeto que se obtiene de la funcion getAllMovies()
  // cuando se ejecuta el metodo find
  this.find({ releaseDate: { $lte: Date.now() } });
  this.startTime = Date.now();
  next();
});

movieSchema.post(/^find/, function (docs, next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.endTime =  Date.now();

  const content = `Query took ${this.endTime - this.startTime} milliseconds to fecht the documents.`;
  
  fs.writeFileSync('./log/log.txt', content, {flag: 'a'}, (err) => {
    console.log(err.message);
  });
  next();
});

// AGGREGATION MIDDLEWARE
movieSchema.pre('aggregate', function (next) {
  //this.find({ releaseDate: { $lte: Date.now() } });
  //this.startTime = Date.now();
  console.log(this.pipeline().unshift({ $match: { releaseDate: {$lte: new Date()} } }));
  next();
});

//Creando el modelo a partir del esquema
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;