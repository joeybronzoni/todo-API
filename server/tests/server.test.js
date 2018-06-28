const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');


const { app } = require('./../server');
const { Todo } = require('./../models/todo');

/* we need to add a testing lifecyle method (bfE) to make sure that the database is empty
   -in order to get data for our GET /todos tests we need to have some data in the db
   our tests will run with no data but our GET expects data so we modify our beforeEach() to add
   some seed data. It will still be predictable, it will look the same when it starts, but will have some
   items in it
*/

// !*!*!note: new ObjectId will give us an OID(_id) to play with for our tests
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},{
  _id: new ObjectID(),
  text: 'Second test todo'
}];

/* Our tests change a little for the GET /todos so this was beforeEach for just our posts tests:

beforeEach((done) => {
  Todo.remove({}).then(() => done());
});
*/

beforeEach((done) => {
  Todo.remove({}).then(() => {
	return Todo.insertMany(todos);
  }).then(() => {
	done();
  });
});


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


// Create 3 test cases for the GET /todos/:id route
// TODO:
/* /todos/:id
   -1) fetches individual todo item and verify a 404 when passing in an invalid _id
   -2) to veify when we pass in a valid id but doesn't match a doc we get 404
   -3) when we pass in a valid id that does match a doc that the doc actually comes back in the response
*/

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


// DELETE /todos/:id:
/* List
   -
   -
   -
   -
   -
*/

describe('DELETE /todos/:id', () => {

  /* we need to send off req but after the req comes back we need to expect a few things about it, and we want to query the database making sure the tod was removed from collection  */
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
