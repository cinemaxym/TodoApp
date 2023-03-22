var createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose'); // Import the Mongoose library
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const usersRouter = require('./routes/users'); //Import usersRouter
const todosRouter = require('./routes/todos') //Import todosRouter

const app = express(); // Create a new express application

let PORT = 8080 || process.env.PORT; // Set the server's port to either the environment variable PORT or the port number 8080


app.use(logger('dev')); // Use the morgan logger middleware to log requests
app.use(express.json()); // Use built-in express middleware to parse JSON data in request bodies
app.use(express.urlencoded({ extended: false })); // Use built-in express middleware to parse URL-encoded request bodies
app.use(cookieParser()); // Use the cookie-parser middleware to parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory


app.use('/', todosRouter); // Mount the todosRouter middleware on the root URL path
app.use('/', usersRouter); // Mount the usersRouter middleware on the root URL path

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404)); // Forward any requests that are not handled by the routes to the error handler middleware
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Connect to the MongoDB database using the provided connection string
mongoose.connect('mongodb+srv://cinemaxym:0IfsKSdl0LOdJXeA@cluster0.chobkzo.mongodb.net/todolist?retryWrites=true&w=majority')
.then(() => console.log('Connected to MongoDB')) // Log a success message if the connection is successful
.catch((error) => // Log an error message if the connection fails
console.log('Error connecting to MongoDB:', error.message));

// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is listening on Port: ${PORT}`);
});

module.exports = app;
