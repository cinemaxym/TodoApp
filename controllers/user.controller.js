const User = require('../models/user.model') //Import User Schema
const mongoose = require('mongoose') //Import mongoose
let jwt = require("jsonwebtoken"); //Import JWT 

// Register a new user
exports.registerUser = async (req, res) => {
    const user = new User({  //Create a new user object with the information from the request body
        username: req.body.username,
        password: req.body.password
    });
    console.log(user)
    try {
        await user.save() //Save the new user object to the database
        res.status(201).json({ message: 'User reqistered successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' }); // Send a 500 error response if there's an error
    }
}

//Log in a user
exports.logInUser = async (req, res) => {
    const { username, password } = req.body; // Extract the username and password from the request body
    try {  // Find the user in the database with the provided username and password
        const user = await User.findOne({ username: username, password: password })
        if (user) { // If user is found, generate a JWT token with a secret key and expiration time, and send it in the response
            let jwtToken = jwt.sign(
                {
                    username: user.username,
                    password: user.password
                },
                'secretKey', { expiresIn: '1h' }
            );
            res.send({ jwtToken });
            console.log("success")
        } else {  // If user is not found, send an error message as a JSON response
            console.log("not found")
            res.send({ message: 'user not Authenticated' });
        }

    } catch (err) { // Send a 500 error response if there's an error
        console.log(err)
        res.status(500).json({ message: 'Server Error' }); 
    }
}
