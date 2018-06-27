const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');


// 3 Ways:
/* 3 ways to find and item in the db with mongoose:

   -1) .find() -lets you query as many 'todos' as you like passing in no args to get
   all queries back or query by anything like by id as we did first

   -2).findOne() similar to find() but only returns 1 doc at most, it grabs the first one
   that matches the query we have and its recommended over find() because it returns the document
   as opposed to an array which makes it alot easier if the thing (id) does not exist, we get null
   instead of an empty array

   -3) great for finding an item by an id and we don't have to make a query object or set an _id as prop

 */

const id = '5b33d6d98365ea645564c080';

if (!ObjectID.isValid(id)) {
  console.log(`ID is not valid`);
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log(`Promise todos:\n ${todos}\n`);
// });

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   if (!todo) {
// 	return console.log('ID not found\n');
//   }
//   console.log(`Promise from todo: \n${todo}\n`);
// });

// Todo.findById(id).then((todo) => {
//   console.log(`Promise from todo findById: \n${todo}`);
// }).catch((e) => console.log(e));

/*
We can handle the findById() errors with catch() but a better way might be to
bring in the ObjectID from the mongoose lib and
*/


// query the users collection  and use User.findById() and handle 3 cases
// if user not found, user was found, and handle any errors
const userId = '5b3270be698c623a36ae4b65';

// we can validate an ObjectID:
if (!ObjectID.isValid(userId)) {
  console.log(`userId is not valid`);
}

User.find({
  _id: userId
}).then((users) => {
  // console.log(`Promise from users: ${users}`);
});

User.findOne({
  _id: userId
}).then((user) => {
//  console.log(`Promise from user: ${user}\n`);
});

User.findById(userId).then((user) => {
  if (!user) {
	return console.log('Unable to find user');
  }
  console.log(JSON.stringify(user, undefined, 2));
})
  .catch((err) => {
	console.log(err);
  });

// ------------- End of User.find()'s ----------------------------//
