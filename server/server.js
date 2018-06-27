// Lib imports
const express = require('express');
const bodyParser = require('body-parser');

// Local imports
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const PORT = 8080;

const app = express();

// Middleware
/* app.use() handles our middleware and if its custom middleware it will usually be a function
 if its 3rd party middleware we will just access it like here with bodyparser which will return a
 function and that is the middleware we need to give to express
*/
app.use(bodyParser.json());

// ------------------todos routes ----------------------------------//
/* POST /todos route:
   Now we need to create the todo using the information that comes from the user
   by creating an instance of a mongoose model
*/
app.post('/todos', (req, res) => {
  var todo = new Todo({
	text: req.body.text
  });

  todo.save().then((doc) => {
	res.send(doc);
  }, (e) => {
	res.status(400).send(e);
  });
});

/* GET /todos route:
   responsible for returning all todos, used to list all of the todos
   *!*Note that we could use res.send(todos) which returns an array but that will
   lock us down if we wanted to add an item to the array like a custom status code
   and a better way would be to use an object with ES6 syntax. Using an object we are
   opening up to a more flexible future .
*/
app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
	res.send({ todos });
  }, (e) => {
	res.status(400).send(e);
  });
});

// ------------------End todos routes ----------------------------------//

// ------------------users routes ----------------------------------//
app.post('/users', (req, res) => {
  var user = new User({
	email: req.body.email
  });

  user.save().then((doc) => {
	res.send(doc);
  }, (e) => {
	res.status(400).send(e);
  });
});

app.get('/users', (req,res) => {
  User.find().then((users) => {
	res.send({ users });
  }, (e) => {
	res.status(400).send(e);
  });
});
// ------------------End users routes ----------------------------------//


// Use `Express running → PORT ${server.address().port}` with back-tics for random port
const server = app.listen(PORT, () => {
  console.log(`Express running on PORT, ${PORT}       →`);
});


module.exports = { app };


// TODO:
/* mongoose
   -We can use the ES6promises as apposed to something like bluebird
     - as a note we could use callbacks but promises are easier to chain, manage and scale
   -Tell Mongoose to use ES6 promises
   -Create a Todo model with mongoose
     - model() is the method we are going to use to create a new model
	 - model() takes 2 args 1)the string name 2)the object with properties
	 - of the attributes we don't need a created_at field because mongo's oid has a
	 timestamp built in
   -the saved() returns an object with keys:
     - __v: means version and comes from mongoose and it keeps track of various model changes over5
	 time
	 -
   -Setting up Models:
     - improve models with validation, smart defaults, make certain properties 'required'
	 - *!*!*!its important to know that mongoose will cast s true and a number like 23 into a string for
	 a field that takes a String as a type
*/

//    -If using jshint and ES6
//	  - /*jshint esversion: 6 */
//        -at the top of file
