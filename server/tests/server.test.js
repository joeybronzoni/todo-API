const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

/* we need to add a testing lifecyle method (bfE) to make sure that the database is empty
   -in order to get data for our GET /todos tests we need to have some data in the db
   our tests will run with no data but our GET expects data so we modify our beforeEach() to add
   some seed data. It will still be predictable, it will look the same when it starts, but will have some
   items in it
*/

const todos = [{
  text: 'First test todo'
},{
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






	/* add a second test case that verifies that a todo does not get created when
	   we send bad data */
	//  Use conditional or expect()
	//  Use conditional or expect()
