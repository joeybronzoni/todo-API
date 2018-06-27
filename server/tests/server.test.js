const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

/* we need to add a testing lifecyle method (bfE) to make sure that the database is empty*/
beforeEach((done) => {
  Todo.remove({}).then(() => done());
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

		Todo.find().then((todos) => {
		  expect(todos.length).toBe(1);
		  expect(todos[0].text).toBe(text);
		  done();
		}).catch((err) => done(e));
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
			expect(todos.length).toBe(0);
			done();
		  })
		  .catch((err) => done(e));
	  });
  });

});







	/* add a second test case that verifies that a todo does not get created when
	   we send bad data */
	//  Use conditional or expect()
	//  Use conditional or expect()
