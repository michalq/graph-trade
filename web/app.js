const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Get routes
const apiv1 = require('./routes/apiv1');

// Initialize an app
const app = express();

global.__base = __dirname;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set routes
app.use('/api/v1', apiv1);

// Catch 404 and forward to error handler.
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.json({
    success: false,
    status: err.status || 500
  });
});

module.exports = app;