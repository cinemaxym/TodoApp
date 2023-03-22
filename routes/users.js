const express = require('express'); // Import Express
const router = express.Router(); // Create an Express router instance
const { restrictToGmail } = require('./middleware'); // Import a custom middleware function
const userController = require('../controllers/user.controller') //Imports user controller

// Handle POST requests to the /login endpoint using the logInUser function in the user controller
router.post('/login', userController.logInUser)


// Handle POST requests to the /register endpoint using the registerUser function in the user controller.
// Also apply the restrictToGmail middleware to the request before handling it with the controller function.
router.post('/register', restrictToGmail, userController.registerUser);


module.exports = router; // Export the router object for use in other modules.
