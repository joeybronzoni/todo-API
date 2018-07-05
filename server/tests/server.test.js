const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');


const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');


//moved seeding functions to seeds.js

// moved seed function in beforeEach() to seeds.js
beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
  //  Use conditional or expect()
  it('does create a new todo', (done) => {
	let text = 'Test todo text';

	request(app)
	  .post('/todos')
	  .send({ text })
	  .expect(200)
	  .expect((res) => {
		expect(res.body.text).toBe(text);
	  })
	  .end((err, res) => {
		if (err) {
		  return done(err);
		}

		Todo.find({ text }).then((todos) => {
		  expect(todos.length).toBe(1);
		  expect(todos[0].text).toBe(text);
		  done();
		}).catch((err) => done(err));
	  });
  });

  //  Use conditional or expect()
  it('does not create a todo with invalid body data', (done) => {

	request(app)
	  .post('/todos')
	  .send({})
	  .expect(400)
	  .end((err, res) => {
		if (err) {
		  return done(err);
		}

		Todo.find()
		  .then((todos) => {
			expect(todos.length).toBe(2); /* there should only be 2 docs in the db because that is defined above the beforeEach() */
			done();
		  })
		  .catch((err) => done(err));
	  });
  });

});


describe('GET /todos', () => {

  it('does get all todos', (done) => {

	request(app)
	  .get('/todos')
	  .expect(200)
	  .expect((res) => {
		expect(res.body.todos.length).toBe(2);
	  })
	  .end(done);
  });

});


describe('GET /todo/:id', () => {
 //  Use conditional or expect()
  it('does return todo doc', (done) => {

	request(app)
	  .get(`/todos/${todos[0]._id.toHexString()}`)
	  .expect(200)
	  .expect((res) => {
		expect(res.body.todo.text).toBe(todos[0].text);
	  })
	  .end(done);
  });

  it('does return 404 if todo not found', (done) => {
	const hexId = new ObjectID().toHexString();

	request(app)
	  .get(`/todos/${hexId}`)
	  .expect(404)
	  .end(done);
  });

  //  Use conditional or expect()
  it('does return 404 for non-object ids', (done) => {
	let id = '123';
	request(app)
	  .get('/todos/123abs')
	  .expect(404)
	  .end(done);

  });


});


describe('DELETE /todos/:id', () => {

  //  Use conditional or expect()
  it('does  remove a todo', (done) => {
	let hexId = todos[1]._id.toHexString();
	request(app)
	  .delete(`/todos/${hexId}`)
	  .expect(200)
	  .expect((res) => {
		expect(res.body.todo._id).toBe(hexId);
	  })
	  .end((err, res) => {
		if (err) {
		  return done(err);
		}
		// query db using findById() toNotExist
		Todo.findById(hexId).then((todo) => {
		  expect(todo).toNotExist(hexId);
		  done();
		})
		  .catch((err) => done(err));

	  });

  });



  //  Use conditional or expect()
  it('does return a 404 if todo not found', (done) => {
  	const hexId = new ObjectID().toHexString();

	request(app)
	  .delete(`/todos/${hexId}`)
	  .expect(404)
	  .end(done);
  });

  //  Use conditional or expect()
  it('does return 404 if object id is invalid', (done) => {
  	let id = '12345sdf';
  	request(app)
	  .delete('/todos/123abs')
	  .expect(404)
	  .end(done);

  });
});

describe('PATCH /todos/:id', () => {
  //  Use conditional or expect()
  it('does update the todo', (done) => {
	let hexId = todos[0]._id.toHexString();
	let text = 'this should be the new text';
	request(app)
	  .patch(`/todos/${hexId}`)
	  .send({
		completed: true,
		text
	  })
	  .expect(200)
	  .expect((res) => {
		expect(res.body.todo.text).toBe(text);
		expect(res.body.todo.completed).toBe(true);
		expect(res.body.todo.completed_at).toBeA('number');
	  })
	  .end(done);
  });

  //  Use conditional or expect()
  it('does clear completed_at when todo is not completed', (done) => {
	let hexId = todos[1]._id.toHexString();
	let completed_at = todos[1].completed_at;
	let text = 'This should be different text from what we defined in the todos var up top !!!';
	request(app)
	  .patch(`/todos/${hexId}`)
	  .send({
		text,
		completed_at
	  })
	  .expect(200)
	  .expect((res) => {
		expect(res.body.todo.text).toBe(text);
		expect(res.body.todo.completed).toBe(false);
		expect(res.body.todo.completed_at).toNotExist();
	  })
	  .end(done);
  });




});


describe('GET /users/me', () => {
  //  Use conditional or expect()
  it('does return a user if authenticated', (done) => {

	  request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
		  expect(res.body._id).toBe(users[0]._id.toHexString());
		  expect(res.body.email).toBe(users[0].email);
		})
		.end(done);
	});

	// make a call to the users/me route
	// don't prvoide a x-auth token and expect a 401 also expect body is = empty object with toEqual()
	//  Use conditional or expect()
	it('does return 401 if not authenticated', (done) => {

	  request(app)
		.get('/users/me')
		.expect(401)
		.expect((res) => {
		  expect(res.body).toEqual({});
		})
		.end(done);
	});
  });

describe('POST /users', () => {

  it('does create a user', (done) => {
	var email = 'example@gmail.com';
	var password = '123asdr';
	request(app)
	  .post('/users')
	  .send({email, password})
	  .expect(200)
	  .expect((res) => {
		console.log('res here:" ', res.body);
		expect(res.headers['x-auth']).toExist();
		expect(res.body._id).toExist();
		expect(res.body.email).toBe(email);
	  })
	  .end((err) => {
		if (err) {
		  return done(err);
		}

		User.findOne({email}).then((user) => {
		  expect(user).toExist();
		  expect(user.password).toNotBe(password);
		  done();
		});


	  });
  });

  //  Use conditional or expect()
  it('does return validation errors if request invalid', (done) => {
	var email = 'ail.com';
	var password = 'sdr';

	request(app)
	  .post('/users')
	  .send({email, password})
	  .expect(400)
	  .expect((res) => {
		expect(email).toExist();
	  })
	  .end(done());

  });

  //  Use conditional or expect()
  it('does not create user if email in use', (done) => {
	var email = users[0].email;
	var password = '123asdr';

	request(app)
	  .post('/users')
	  .send({email, password})
	  .expect(400)
	  .expect((res) => {
		expect(email).toExist();
	  })
	  .end((err) => {
		if (err) {
		  return done(err);
		}

		User.findOne({ email }).then((user) => {
		  expect(user).toExist();
		  done();
		});
	  });
  });


});
