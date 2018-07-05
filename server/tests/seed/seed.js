const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt  = require('bcryptjs');

const { Todo } = require('./../../models/todo');

const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'joey@gmail.com',
  password: 'userOnePass',
  tokens: [{
	access: 'auth',
	token: jwt.sign({_id: userOneId, access: 'auth'}, 'OliverJames').toString()
  }]
}, {
  _id: userTwoId,
  email: 'janice@gmail.com',
  password: 'userTwoPass',
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completed_at: 333
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
	return Todo.insertMany(todos);
  }).then(() => {
	done();
  });
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
	const userOne = new User(users[0]).save();
	const userTwo = new User(users[1]).save();

	return Promise.all([userOne, userTwo]);
  }).then(() => done());

};
module.exports = { todos, populateTodos, users, populateUsers };
