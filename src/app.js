require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
// const xss = require('xss)
const { NODE_ENV, API_TOKEN } = require('./config');

const foldersRouter = require('./folders-router');
const notesRouter = require('./notes-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/folders', foldersRouter);
app.use('/api/notes', notesRouter);

app.use(function errorHandler(error, req, res, next) {
  /* eslint-disable-line no-unused-var */ let response;
  if (NODE_ENV === 'production') {
    console.error(error);
    response = { error: { message: 'Internal server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
