require('./config/config');

// Lib imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');


// Local imports
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');
const PORT = process.env.PORT; // || 8080;

const app = express();

app.use(bodyParser.json());


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

app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
	res.send({ todos });
  }, (e) => {
	res.status(400).send(e);
  });
});

app.get('/todos/:id', (req,res) => {
  const id = req.params.id;

  // validate id
  if (!ObjectID.isValid(id)) {
    //404 send back empty send: use return to stop the execution
	return res.status(404).send();
  }
  // findById()
  Todo.findById(id).then((todo) => {

	if (!todo) {
	  // use return to stop the execution
	  return res.status(404).send();
	}
	/* success: we don't want to send the todo back in case of sensitive info
	   !*!* Note, we could send the res like this: res.send(todo) and that would work but we should
	   send it in an object where the todo is attached as a property using ES6 object definition so
	   we can tac on custom status codes etc.
	*/
	res.send({ todo });
  }).catch((e) => {
	// we may not want to send any sensitive info back
	res.status(400).send();
  });

});

// use pick to grab the email and the password
app.delete('/todos/:id', (req, res) => {
  // get id
  const id = req.params.id;

  // validate id --> not valid? return 404
  if (!ObjectID.isValid(id)) {
	return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
	// remove todo by id
	if (!todo) {
	  return res.status(404).send();
	}

	res.send({todo});
  }).catch((e) => {res.status(400).send();});

});

app.patch('/todos/:id', (req,res) => {

  // grab id form parameters
  var id = req.params.id;

  /* create a body variable that has a subset of the things that the user passed to us.
	 We don't want to user to be able to update anything they choose so the _.pick() utility
	 method gives us this option*/
  var body = _.pick(req.body, ['text', 'completed']);

  // validate id --> not valid? return 404
  if (!ObjectID.isValid(id)) {
	return res.status(404).send();
  }

  /* we update the completed_at property based off of the completed property */
  if (_.isBoolean(body.completed) && body.completed) {
	body.completed_at = new Date().getTime();
  } else {
	body.completed = false;
	body.completed_at = null;
  }


  /* We make are call to findByIdAndUpdate */
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
	.then((todo) => {
	  if (!todo) {
		return res.status(400).send();
	  }
	  console.log('todo, line 170-server.js: ', todo);
	  res.send({todo});
	})
	.catch((err) => {
	  res.status(400).send();
	});

});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  var user = new User(body);

  user.save()
	.then(() => {
	  return user.generateAuthToken();
	}).then((token) => {
	  res.header('x-auth', token).send(user);
	}).catch((e) => {
	  // console.log('this is the error: ', e.errmsg);
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

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

const server = app.listen(PORT, () => {
  console.log(`Express running on PORT, ${PORT}         →`);
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
