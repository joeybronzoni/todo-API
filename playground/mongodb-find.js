const { MongoClient, ObjectID } = require('mongodb');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

let obj = new ObjectID();
console.log('obj: ', obj);

MongoClient.connect(process.env.DATABASE, (err, db) => {
  if (err) {
	return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server Success!');

  // query users looking for docs with the name = yim yames
  db.collection('Users').find({name: 'YimYames'}).toArray().then((docs) => {

	/*  for this find() we need to comment out the db.close() it will cause problems*/
	console.log('Users: ');
	console.log(JSON.stringify(docs, undefined, 2));

  }, (err) => {
	console.log('Unable to fetch users: ', err);
  });

  // db.collection('Todos').find().count().then((count) => {
  // 	/*  for this find() we need to comment out the db.close() it will cause problems*/
  // 	console.log(`Todos count: ${count}`);
  // }, (err) => {
  // 	console.log('Unable to fetch todos: ', err);
  // });

  db.close();
});



// MONGO :
/* find()
   - find() returns a db cursor which is a pointer to the documents and the cursor has methods
   -we can tac on a cursor method toArray() which returns a promise so we can add .then() with a callback
   -in the mongodb docs we can find all the methods available on each cursor i.e-find({})
   -
*/




// find9{}
/*   db.collection('Todos').find({
	_id: new ObjectID('5b3189a1702bae51c57c90c6')
  }).toArray().then((docs) => {

  // In order to query the _id we need to use the ObjectID() constructor function that we required

    for this find() we need to comment out the db.close() it will cause problems
	console.log('Todos: ');
	console.log(JSON.stringify(docs, undefined, 2));

  }, (err) => {
	console.log('Unable to fetch todos: ', err);
  });
*/
