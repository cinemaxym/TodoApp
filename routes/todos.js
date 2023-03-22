const express = require('express'); // Import Express
const router = express.Router(); // Create an Express router instance
const todoController = require('../controllers/todo.controller') //Import todo controller
const { validateTaskLength, contentTypeValidation, checkJWTToken } = require('./middleware'); // Import a custom middleware function


// Define routes for the TODO list API
//GET all todos
router.get('/todos', checkJWTToken, todoController.getTodos);

//POST a new todo 
// Also apply the validateTaskLength and the contentTypeValidation middleware to the request before handling it with the controller function.
router.post('/todos/add', validateTaskLength, contentTypeValidation, checkJWTToken, todoController.addTodo);

// DELETE a specific todo by ID
router.delete('/todos/delete', todoController.deleteTodo);

//PUT/EDIT mode todo
router.put('/todos/edit', todoController.editTodo);

// PUT/UPDATE a specific todo by ID
router.put('/todos/update', todoController.updateTodo);

// PUT/UPDATE a specific todo by ID
router.put('/todos/complete', todoController.completeTodo);

module.exports = router; // Exports the router object 
