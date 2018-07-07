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
	  .set('x-auth', users[0].tokens[0].token)
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
	  .set('x-auth', users[0].tokens[0].token)
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
	  .set('x-auth', users[0].tokens[0].token)
	  .expect(200)
	  .expect((res) => {
		expect(res.body.todos.length).toBe(1);
	  })
	  .end(done);
  });

});

describe('GET /todo/:id', () => {
 //  Use conditional or expect()
  it('does return todo doc', (done) => {

	request(app)
	  .get(`/todos/${todos[0]._id.toHexString()}`)
	  .set('x-auth', users[0].tokens[0].token)
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
	  .set('x-auth', users[1].tokens[0].token)
	  .expect(404)
	  .end(done);
  });

  it('does return 404 for non-object ids', (done) => {
	let id = '123';
	request(app)
	  .get('/todos/123abs')
	  .set('x-auth', users[0].tokens[0].token)
	  .expect(404)
	  .end(done);
  });

  it('does not return todo doc created by other user', (done) => {

	request(app)
	  .get(`/todos/${todos[1]._id.toHexString()}`)
	  .set('x-auth', users[0].tokens[0].token)
	  .expect(404)
	  .end(done);
  });


});


describe('DELETE /todos/:id', () => {

  it('does remove a todo', (done) => {
	let hexId = todos[0]._id.toHexString();

	request(app)
	  .delete(`/todos/${hexId}`)
	  .set('x-auth', users[1].tokens[0].token)
	  .expect(404)
	  .end((err, res) => {
		if (err) {
		  return done(err);
		}
		// query db using findById() toNotExist
		Todo.findById(hexId).then((todo) => {
		  expect(todo).toBeTruthy();
		  done();
		})
		  .catch((err) => done(err));
	  });

  });

  it('does not remove a todo if it was created by a different user', (done) => {
	let hexId = todos[1]._id.toHexString();

	request(app)
	  .delete(`/todos/${hexId}`)
	  .set('x-auth', users[0].tokens[0].token)
	  .expect(404)
	  .end((err, res) => {
		if (err) {
		  return done(err);
		}
		// query db using findById() toNotExist
		Todo.findById(hexId).then((todo) => {
		  expect(todo).toBeTruthy();
		  done();
		})
		  .catch((err) => done(err));
	  });

  });

  it('does return a 404 if todo not found', (done) => {
  	const hexId = new ObjectID().toHexString();
	// const hexId = todos[0]._id.toHexString();
	request(app)
	  .delete(`/todos/${hexId}`)
	  .set('x-auth', users[0].tokens[0].token)
	  .expect(404)
	  .end(done);
  });

  it('does return 404 if object id is invalid', (done) => {
  	let id = '12345sdf';
  	request(app)
	  .delete('/todos/123abs')
	  .set('x-auth', users[0].tokens[0].token)
	  .expect(404)
	  .end(done);

  });
});

describe('PATCH /todos/:id', () => {

  it('does update the todo', (done) => {
	let hexId = todos[0]._id.toHexString();
	let text = 'this should be the new text';
	request(app)
	  .patch(`/todos/${hexId}`)
	// authenticate as first user
	  .set('x-auth', users[0].tokens[0].token)
	  .send({
		completed: true,
		text
	  })
	  .expect(200)
	  .expect((res) => {
		expect(res.body.todo.text).toBe(text);
		expect(res.body.todo.completed).toBe(true);
		// expect(res.body.todo.completed_at).toBeA('number');
		expect(typeof res.body.todo.completed_at).toBe('number');
	  })
	  .end(done);
  });

  it('does NOT update the todo created by other user', (done) => {
	let hexId = todos[0]._id.toHexString();
	let text = 'this should be the new text';
	request(app)
	  .patch(`/todos/${hexId}`)
	// authenticate as first user
	  .set('x-auth', users[1].tokens[0].token)
	  .send({
		completed: true,
		text
	  })
	  .expect(404)
	  .end(done);
  });

  it('does clear completed_at when todo is not completed', (done) => {
	let hexId = todos[1]._id.toHexString();
	let completed_at = todos[1].completed_at;
	let text = 'This should be different text from what we defined in the todos var up top !!!';
	request(app)
	  .patch(`/todos/${hexId}`)
	  .set('x-auth', users[1].tokens[0].token)
	  .send({
		text,
		completed_at
	  })
	  .expect(200)
	  .expect((res) => {
		expect(res.body.todo.text).toBe(text);
		expect(res.body.todo.completed).toBe(false);
		expect(res.body.todo.completed_at).toBeFalsy();
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
		expect(res.headers['x-auth']).toBeTruthy();
		expect(res.body._id).toBeTruthy();
		expect(res.body.email).toBe(email);
	  })
	  .end((err) => {
		if (err) {
		  return done(err);
		}

		User.findOne({email}).then((user) => {
		  expect(user).toBeTruthy();
		  expect(user.password).not.toBe(password);
		  done();
		}).catch(e => done(e));
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
		expect(email).toBeTruthy();
	  })
	  .end((err) => {
		if (err) {
		  return done(err);
		}

		User.findOne({ email }).then((user) => {
		  expect(user).toBeTruthy();
		  done();
		});
	  });
  });
});


describe('POST /users/login', () => {
  //  Use conditional or expect()
  it('does login user and return auth token', (done) => {
	 const email = users[1].email;
	 const password = users[1].password;

	request(app)
	  .post('/users/login')
	  .send({
		email,
		password
	  })
	  .expect(200)
	  .expect((res) => {
		expect(res.headers['x-auth']).toBeTruthy();
	  })
	  .end((err, res) => {
		if (err) {
		  return done(err);
		}

		User.findById(users[1]._id)
		  .then((user) => {
			expect(user.toObject().tokens[1]).toMatchObject({
			  access: 'auth',
			  token: res.headers['x-auth']
			});
			done();
		  }).catch(e => done(e));
	  });
  });

  // pass invlaid passwd, should be 400, should not exist token.length =0
  it('does reject invalid login', (done) => {
	const email = users[1].email;
	const password = users[1].password +'1';

	request(app)
	  .post('/users/login')
	  .send({
		email,
		password
	  })
	  .expect(400)
	  .expect((res) => {
		expect(res.headers['x-auth']).toBeFalsy();
	  })
	  .end((err, res) => {
		if (err) {
		  return done(err);
		}

		User.findById(users[1]._id)
		  .then((user) => {
			expect(user.tokens.length).toBe(1);
			done();
		  }).catch(e => done(e));
	  });
  });

});

describe('DELETE /users/me/token', () => {
  //  Use conditional or expect()
  it('does remove auth token on logout', (done) => {
	let token = users[0].tokens[0].token;
	console.log('token:' , token);
	request(app)
	  .delete('/users/me/token')
	  .send({ token })
	  .set('x-auth', users[0].tokens[0].token)
	  .expect(200)
	  .expect((res) => {
		expect(res.body.token).toEqual(undefined);
	  })
	  .end((err, res) => {
		if (err) {
		  return done(err);
		}

		User.findById(users[0]._id)
		  .then((user) => {
			expect(user.tokens.length).toBe(0);
			done();
		  }).catch(e => done(e));
	  });

  });

});
