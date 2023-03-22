const mongoose = require('mongoose'); // Import the Mongoose library 

//Define a Mongoose schema for a Todo

let TodoSchema = mongoose.Schema({
    todo: {
        type: String,
        required: true
    },
    editing: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false 
    }
});

module.exports = mongoose.model('Todo', TodoSchema) //Export a Mongoose model for the TodoSchema as a Todo document.