const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

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
app.listen(port, () => {
  console.log('Server has started...');
});