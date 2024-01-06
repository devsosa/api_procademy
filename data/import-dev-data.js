const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Movie = require('../models/movie.model');

// Guardar las variables definidas en .env en las variables de entorno de NodeJS
dotenv.config({path: './.env'});

//Coneccion a base de datos
mongoose.connect(process.env.CONN_STR)
  .then((conn) => {
    //console.log(conn);
    console.log('DB Connection Successful...');
  })
  .catch((err) => {
    console.log('Some error has acurred!!!');
  });

//Cargando los datos del archivo y convirtiendolos en un objeto js
let movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));

//Eliminar todos las colecciones de movies document
const deleteMovies = async () => {
  try {
    await Movie.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
}

//Importar todoas las colecciones desde el archivo movies.json a mongodb
const importMovies = async () => {
  try {
    await Movie.create(movies);
    console.log('Data successfully imported!');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
}

if(process.argv[2] === '--import') {
  importMovies();
}
if(process.argv[2] === '--delete') {
  deleteMovies();
}

//console.log(process.argv);
/* 
[
  '/home/carlitox/.nvm/versions/node/v18.18.2/bin/node',
  '/home/carlitox/projects/nodeJs/node-procademy/node-express/data/import-dev-data.js'
]
*/