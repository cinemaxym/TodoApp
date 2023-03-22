const mongoose = require('mongoose'); // Import the Mongoose library 

//Define a Mongoose schema for a User

let UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
        
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema) //Export a Mongoose model for the UserSchema as a User document.