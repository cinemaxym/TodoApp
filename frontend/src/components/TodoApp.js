import React from 'react'; //Import React
import Button from 'react-bootstrap/Button' //Imports Button component 
import Form from 'react-bootstrap/Form' //Imports Form component 
import Card from 'react-bootstrap/Card'; //Imports Card component 
import '../styles/todoAppStyles.css'; //Import styles
import { BsTrash3, BsPencil, BsSend } from "react-icons/bs"; //Imports icons 

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        // Set the initial state of the component
        this.state = {
            logedIn: false,
            register: false,
            logIn: false,
            message: "",
            inputUsername: "",
            inputPassword: "",
            token: null,
            todos: [],
            inputTodo: "",
            inputTodoId: "",
            newInputTodo: "",
            newInputTodoId: "",
            completed: false,
            display: false
        }

        // Bind "this" to the class methods, so they can access state and props
        this.registerUser = this.registerUser.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.logInUser = this.logInUser.bind(this);

        this.displayTodos = this.displayTodos.bind(this);
        this.addTodo = this.addTodo.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
        this.editTodo = this.editTodo.bind(this);
        this.updateTodo = this.updateTodo.bind(this);

        this.handleCompletedTodo = this.handleCompletedTodo.bind(this)

    }


    // Event hahdler updates the appropriate input field in state as the user types
    handleInput(e) {
        const input = e.target.id
        if (input === "input1") {
            this.setState({
                inputUsername: e.target.value
            })
        } else if (input === "input2") {
            this.setState({
                inputPassword: e.target.value
            })
        } else if (input === "inputTodo") {
            this.setState({
                inputTodo: e.target.value
            })
        } else if (input === "updateTodo") {
            this.setState({
                newInputTodo: e.target.value
            })
        }
    }

    // Send a POST request to the server to register the user
    registerUser() {
        // Create a user object with the inputted username and password
        let user = {
            username: this.state.inputUsername,
            password: this.state.inputPassword
        }

        fetch('/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                this.setState({ message: data.message }); // Set the message state to the message returned from the server
            }, (err) => {
                console.log(err)
            });
        // Set the register state to false (presumably to close the registration form)
        this.setState({
            register: false,
        })
    }

    // send a POST request to the /login endpoint with the user's credentials
    logInUser() {
        // create an object with the user's credentials
        let user = {
            username: this.state.inputUsername,
            password: this.state.inputPassword
        }
        fetch('/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // set the token and message state variables based on the response from the server
                this.setState({
                    token: data.jwtToken,
                    message: data.message
                });
            }, (err) => {
                console.log(err)
            });
        // reset the logIn state variable to false
        this.setState({
            logIn: false
        })

        //Refresh the displayed projects
        setTimeout(this.displayTodos, 1000)
    }
    // Fetch todos from the server and update the state with the data
    displayTodos() {
        fetch('/todos', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Token": `${this.state.token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.setState({ 
                    todos: data.todos,
                    message: data.message,
                    display: data.display
                 });
            }, (err) => {
                console.log(err)
            });
    }

    // Send a POST request to the server to add a new todo
    addTodo() {
        // Clear any previous message
        this.setState({
            message: ""
        });
        // Prepare the todo object
        let todo = {
            todo: this.state.inputTodo
        }

        fetch('/todos/add', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Token": `${this.state.token}`
            },
            body: JSON.stringify(todo)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Log the response data and update the message state
                this.setState({
                    message: data.message
                });
            }, (err) => {
                console.log(err)
            });
        
        // Clear the input field and refresh the todo list
        this.setState({
            inputTodo: ""
        })

        //Refresh the displayed projects
        setTimeout(this.displayTodos, 500)
    }

    // Send a DELETE request to the server to delete the todo with the given id
    deleteTodo(e) {
        // Get the id of the todo to be deleted from the clicked element's id attribute
        let id = e.currentTarget.id
        fetch('/todos/delete', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            }, (err) => {
                console.log(err)
            });

        // After deleting the project, refresh the displayed projects
        this.displayTodos()
    }

    // Send a PUT request to the server to set the 'editing' field of the selected todo to true
    editTodo(e) {
        const todo = this.state.todos // Get the array of todos from the component state
        console.log(todo)
        console.log(e.currentTarget.value)
        this.setState({  // Update the info of the selected todo in the input field
            newInputTodo: todo[e.currentTarget.value].todo,
            newInputTodoId: todo[e.currentTarget.value]._id,
        })

        let id = e.currentTarget.id;
        let editing = true;  // set the editing flag to true
        fetch('/todos/edit', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, editing })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            }, (err) => {
                console.log(err)
            });

        // Refresh the displayed projects
        this.displayTodos()
    }

    // Send a PUT request to the server to update the todo
    updateTodo() {
        // Create a new todo object with the updated data
        let todo = {
            id: this.state.newInputTodoId,
            todo: this.state.newInputTodo,
            editing: false // set the editing flag to false
        }
        console.log(todo)

        // Send a PUT request to the server to update the car
        fetch('/todos/update', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            }, (err) => {
                console.log(err)
            });

        // Refresh the displayed projects
        this.displayTodos()
    }
    
    // Send a PUT request to the server to update the completed status of the todo item
    handleCompletedTodo(e) {
        // Get the id of the completed todo item and its completed status
        let id = e.target.id;
        let completed = e.target.checked;

        fetch('/todos/complete', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, completed })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            }, (err) => {
                console.log(err)
            });

        // Refresh the displayed projects
        this.displayTodos()
        
    }

    render() {
        return (
            <div className='main-container'>
                {/* Conditionally render the login/register form if the user is not logged in */}
                {!this.state.register && !this.state.token && !this.state.logIn ?
                    <Card className='login-container'>
                        <Card.Body>
                            <p style={{color:'red'}} >{this.state.message}</p>
                            <Button className="btn" variant="primary" onClick={() => {this.setState({ logIn: true })}} >Log In</Button> {' '}
                            <Button className="btn" variant="outline-primary" onClick={() => {this.setState({ register: true })}}  >Register</Button>
                        </Card.Body>
                    </Card>
                    : ""}
                {/* Conditionally render the login/register form if the user has clicked the Log In or Register button */}
                {this.state.register || this.state.logIn ?
                    <Card className='login-container'>
                        <Card.Body>
                            <Form.Control
                                type="text"
                                id="input1"
                                placeholder="Enter username"
                                value={this.state.inputUsername}
                                onChange={this.handleInput} /><br />
                            <Form.Control
                                type="text"
                                id="input2"
                                placeholder="Enter password"
                                value={this.state.inputPassword}
                                onChange={this.handleInput} /><br />
                            {this.state.register ?
                                <Button variant="primary"
                                onClick={this.registerUser} >Register</Button> :
                                <Button variant="primary" onClick={this.logInUser} >Log In</Button>
                            }

                        </Card.Body>
                    </Card>
                    : ""}
                {/* Conditionally render the Add Task form if the user is logged in */}
                {this.state.token ?
                    <Card className='login-container'>
                        <Card.Body>
                        <p style={{color:'red'}} >{this.state.message}</p>
                            <div className='addTask-block'>
                                <Form.Control type="text" id="inputTodo" placeholder="Enter task" value={this.state.inputTodo} onChange={this.handleInput} />
                                <Button variant="primary" onClick={this.addTodo} ><BsSend/></Button>
                            </div>
                        </Card.Body>
                    </Card>
                    : ""}
                {/* Conditionally render the list of todos if the user is logged in */}
                {this.state.display ?
                    this.state.todos.map((todo, id) => {
                        // If the todo is not being edited, display its text and delete and edit buttons
                        if (!todo.editing) {
                            return <Card className='todo-container' key={id}>
                                <div className='addTask-block editTask-block'>
                                    <Form.Check checked={todo.completed} onChange={this.handleCompletedTodo} id={todo._id} />
                                    <div className='card-text'>
                                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                            {todo.todo}
                                        </span>
                                    </div>
                                    <div>
                                        <Button variant="outline-primary" id={todo._id} onClick={this.deleteTodo}><BsTrash3/></Button>
                                        <Button variant="outline-primary" id={todo._id} value={id} onClick={this.editTodo} > <BsPencil/></Button>
                                    </div>
                                </div>
                            </Card>
                        }
                        // If the todo is being edited, display an input field and an update button
                        return <Card className='todo-container' key={id}>
                            <div className='addTask-block editTask-block'>
                                <Form.Control type="text" id="updateTodo" value={this.state.newInputTodo} onChange={this.handleInput} />
                                <Button variant="outline-primary" size="sm" id={todo._id} onClick={this.updateTodo} >Update</Button>
                            </div>
                        </Card>

                    })
                    : ""}
            </div>
        )
    }
}

export default TodoApp; //exports TodoApp component

