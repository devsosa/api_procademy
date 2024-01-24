const express = require('express');
const moviesRouter = require('./routes/movies.routes');
const authRouter = require('./routes/auth.routes');
const CustomError = require('./utils/custom.error');
const globalErrorHandler = require('./controllers/error.controller');

let app = express();
app.use(express.json());
app.use(express.static('./public'));

app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/users', authRouter);
app.all('*', (req, res, next) => {
  /* res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on the server!`
  }); */
  //usando el middleware global
  //const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  //err.status = 'fail';
  //err.statusCode = 404;
  const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);

  next(err);
});

app.use(globalErrorHandler);

module.exports = app;