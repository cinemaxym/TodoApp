const Todo = require('../models/todo.model') //Import Todo Schema
const mongoose = require('mongoose') //Import mongoose
let jwt = require("jsonwebtoken"); //Import JWT 

// List all todos from your database.
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find(); // Find all todos in the database
        res.status(200).json({ todos, display: true }) // Send a JSON response containing todos
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error'}); // Send a 500 error response if there's an error
    }
};

// Add a new todo to the database.
exports.addTodo = async (req, res) => {
    const todo = new Todo ({
        todo: req.body.todo
    }); // Create a new todo object with the information from the request body
    console.log(todo)
    try {
        await todo.save() // Save the new todo object to the database
        res.status(201).json('Todo added successfully');
    } catch (err) { // Send a JSON response indicating that the todo was not created successfully
        console.log(err);
        res.status(500).json({message: 'Server Error'});
    }            // Send a 500 error response if there's an error             
};


// Delete a specific todo document.
exports.deleteTodo = async (req, res) => {
    try {    // Find and delete a todo document by ID passed in the request body.
        const deletedTodo = await Todo.findByIdAndDelete(req.body.id);
        if(!deletedTodo) {  // Send a 404 error response if the todo is not found
            return res.status(404).json({message: 'Todo not found'});
        }   // Return deleted todo document.
        res.status(200).json('Todo deleted successfully');
    } catch (err) {
        console.log(err);     // Return a server error message.
        res.status(500).json({message: 'Server Error'});
    }
}

// Edit a specific todo document.
exports.editTodo = async (req, res) => {
    try {  // Extract the information about the todo from the request body
        const { id, editing } = req.body;
        await Todo.updateMany({},  // Update all todo documents 
        { $set: {editing: false}}, { new: true });//by setting 'editing' field to the value false
        await Todo.findByIdAndUpdate(
            id, // Find the todo with the specified ID
            { $set: {editing}}, // Update the todo with the new information
            { new: true }); // Return the updated todo object
            res.status(200).json('Todo updated successfully');
    } catch (err) {
        console.log(err);   // Send a 500 error response if there's an error
        res.status(500).json({message: 'Server Error'});
    }
};

// Update a specific todo document.
exports.updateTodo = async (req, res) => {
    try {  // Extract the information about the todo from the request body
        const { id, todo, editing } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            id, // Find the todo with the specified ID
            { todo, editing }, // Update the todo with the new information
            { new: true }); // Return the updated todo object
            if(!updatedTodo) {  // Send a 404 error response if the todo is not found
                return res.status(404).json({message: 'Todo not found'});
            }  // Send a JSON response indicating that the todo was updated successfully
            res.status(200).json('Todo updated successfully');
    } catch (err) {
        console.log(err);   // Send a 500 error response if there's an error
        res.status(500).json({message: 'Server Error'});
    }
};

// Complete a specific todo document.
exports.completeTodo = async (req, res) => {
    try {  // Extract the information about the todo from the request body
        const { id, completed } = req.body;
        await Todo.findByIdAndUpdate(
            id, // Find the todo with the specified ID
            { $set: {completed}}, // Update the todo with the new information
            { new: true }); // Return the updated todo object
            res.status(200).json('Todo updated successfully');
    } catch (err) {
        console.log(err);   // Send a 500 error response if there's an error
        res.status(500).json({message: 'Server Error'});
    }
};


