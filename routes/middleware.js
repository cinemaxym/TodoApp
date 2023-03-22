let jwt = require("jsonwebtoken");

//Respond with an HTTP 403 to all requests by users whose usernames don’t end with the substring ‘@gmail.com’.
function restrictToGmail(req, res, next) {
    if (!req.body.username.endsWith('@gmail.com')) { // check if username doesn't end with '@gmail.com'
        res.status(403).send({message:'Access denied. Only Gmail users are allowed.'});
    } else {    // respond with HTTP 403 Forbidden status code
        next(); // allow the request to proceed to the next middleware or route handler
    }
}

//Reject the addition of tasks that exceed 140 characters.
function validateTaskLength(req, res, next) {
    if(req.body.todo.length > 140) { // check if the length of the todo in the request body is greater than 140 characters
        res.status(400).send({message:'Task is to long. Max length is 140 characters'});
    } else {    // respond with HTTP 400 Bad Request status code
        next(); // allow the request to proceed to the next middleware or route handler
    }
}

//Reject any requests that are not of the JSON content type. 
function contentTypeValidation(req, res, next) {
    const contentType = req.header("Content-Type"); // get the content type of the request header
    console.log(contentType)
    if(!contentType || !contentType.includes("application/json")) { // check if the content type is missing or not equal to 'application/json'
        res.status(415).send({message:'Unsupported media type. Only JSON is supported.'})
    } else {  // respond with HTTP 415 Unsupported Media Type status code
        next(); // allow the request to proceed to the next middleware or route handler
    }
}

//Ensure all relevant endpoints to a to-do list route are secure.
function checkJWTToken (req, res, next) {
    // Check if token is present in the request header
    if(req.headers.token) {
        let token = req.headers.token;
        // Verify the token using the secret key
        jwt.verify(token, 'secretKey', function (error, data) {
            // If there's an error with the token, return an error response
            if(error) {
                res.status(498).send({message: 'Invalid Token', display: false});
            } else {
                // If the token is valid, move to the next middleware or route handler
                next(); 
            }
        });
    } else {
        // If there's no token attached to the request, return an error response
        res.status(400).send({message: 'No token attached to the request', display: false });
    }
}


//Export middleware modules
module.exports = {
    restrictToGmail,
    validateTaskLength,
    contentTypeValidation,
    checkJWTToken

};