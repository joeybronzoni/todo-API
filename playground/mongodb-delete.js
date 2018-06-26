// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });


MongoClient.connect(process.env.DATABASE, (err, db) => {
  if (err) {
	return console.log('Unable to connect to MongoDg server');
  }
  console.log('Connected to MongoDB server Success!');

  // deleteMany
  /* 	db.collection('Todos').deleteMany({text: 'Create some docker containers!'}).then((result) => {
	console.log('Result: ', result);
	});*/


  // deleteOne
  /*
	db.collection('Todos').deleteOne({text: 'Something to do'}).then((result) => {
	console.log('Result: ', result);
	});*/

  // findOneAndDelete
  /*   db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	   console.log(`Result: ${JSON.stringify(result, undefined, 2)}`);
	   });
  */

  // find any duplicates
  /*db.collection('Todos').deleteMany({text: 'Create some docker containers!'}).then((result) => {
	console.log('Result: ', result);
  });
  */

  // delete record by id
  /*db.collection('Todos').deleteOne({
	_id: new ObjectID('5b3189a1702bae51c57c90c6')
  }).then((results) => {
	console.log(JSON.stringify(results, undefined, 2));
  }, (err) => {
	console.log('Unable to fetch todos: ', err);
  });
*/

  /*
  db.collection('Users').findOneAndDelete({
	_id: new ObjectID('5b3181dcab25ae6ea4aa77ba')
  }).then((result) => {
	console.log(`User Deleted: ${JSON.stringify(result, undefined, 2)}`);
  });*/

  // db.close();
});


// TODO:
/* delete<n>()
   -deleteMany() returns a bunch of data but the one that is imprtant to me is at the top where
   result: {n: 4, ok: 1}
     - this means that the ok:1 means that everything went as expected and that n: 4 is the
	 number of records that were deleted

   -deleteOne() is the same as deleteMany() except it deletes the first record found that matches
   the query/criteria and then it stops

   -findOneAndDelete() is for when I have the _id but don't have the info of the record, whether its the text, the completed
   status, or name.
     - depending on the UI it can be helpful. Say if I have a todo that says 'eat lunch' and I want to
	 show that down below saying you've deleted a tod that says 'eat lunch' with a little button that
	 gives the user an option to undo if it wer an accident. So it's good for getting data back
	 - When you delete a record with findOneAndDelete() we get a response back in a lastErrorObject {} containing the
	 n value
*/
