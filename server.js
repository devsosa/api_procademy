const dotenv = require('dotenv');
const mongoose = require('mongoose');

/* Control Uncaught Exceptions */
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception ocurred! Shutting down...');

  process.exit(1);
});

const app = require('./app');

// Guardar las variables definidas en .env en las variables de entorno de NodeJS
dotenv.config({path: './.env'});

//Coneccion a base de datos
mongoose.connect(process.env.CONN_STR)
  .then((conn) => {
    //console.log(conn);
    console.log('DB Connection Successful...');
  })
  /* .catch((err) => {
    console.log('Some error has acurred!!!');
  }); */

/* const testMovie = new Movie({
  name: 'Interstellar',
  description: 'A trilling sci-fi movie with space adventure and great action.',
  duration: 180
});

//creando y guardando la nueva coleccion en la base de datos
testMovie.save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log('Error ocurred: ' + err);
  }); */

//Create a server
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('Server has started...');
});

/* Control a goblal errors */
/* Control all rejected promises */
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection ocurred! Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});
