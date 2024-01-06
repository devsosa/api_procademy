const express = require('express');
const moviesRouter = require('./routes/movies.routes');

let app = express();
app.use(express.json());
app.use(express.static('./public'));

app.use('/api/v1/movies', moviesRouter);

module.exports = app;