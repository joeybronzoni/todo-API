const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Mongo gives us 3 methods for deleting our records:
//
/* .remove():
   -Works like .find()
   -difference between .remove() and .find() is that you can't pass in an empty argument
   and expect all the documents to get removed
   -<item>.remove({}).then((res) => {
   console.log(`Promise from res: ${res}`);
   });
   to remove everything from the collection
   -we don't get the data/object back with this method like we do woth findOneAndRemove()

   -findOneAndRemove()
     - works like findOne() but also returns the data so we can do something with it

   -findByIdAndRemove()
     -just like it says find one by the id and removes it, this also returns the data
	 for us to do something with.
   -
*/


// Todo.remove({}).then((res) => {
//   console.log(`Promise from res: ${res}`);
// });

// Todo.findByIdAndRemove('5b34261dc44b27b72a03d293').then((todo) => {
//   console.log(JSON.stringify(todo, undefined, 2));
// });

Todo.findOneAndRemove({ _id: '5b342641c44b27b72a03d294'}).then((todo) => {
  console.log(JSON.stringify(todo, undefined, 2));
});
