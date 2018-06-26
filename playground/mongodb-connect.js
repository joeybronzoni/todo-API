// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });


MongoClient.connect(process.env.DATABASE, (err, db) => {
  if (err) {
	return console.log('Unable to connect to MongoDg server');
  }
  console.log('Connected to MongoDB server Success!');


  /*
	db.collection('Todos').insertOne({
  	text: 'Create some docker containers!',
  	completed: false
	}, (err, result) => {
  	if (err) {
  	return console.log('Unable to insert todo', err );
  	}

  	console.log(JSON.stringify(result.ops, undefined, 2));
	});
  */

  /*db.collection('Users').insertOne({
	name: 'jennyBean',
  	age: 28,
  	location: 'Bitch-Town'
	}, (err, result) => {
  	if (err) {
  	return console.log('Unable to insert todo', err );
  	}

  	// console.log(JSON.stringify(result.ops, undefined, 2));
	console.log(result.ops[0]._id.getTimestamp());
	});
  */

  // db.close();
});




// Insert new doc into Users (name, age, location)

// TODO:
/* Mongodb
   - *!*! difference in API between mongo v2 and mongov 3, down above I have
   mongo v2 version of code but below is for v3 and the changes have to do with argument, a
   new line and a change in where we access the close() method. The new arg is client instead of db
   and the db we get from the new line where const db = client.db('Todos') and the close() method
   changed from db.close() to client.close()

   -results.ops, where the ops attribute is going to store all of the docs that were inserted
   -then we pass undefined and 2 for the filter function

   -The mongo '_id':
     - its not an auto-incrementing number like postgres/MySQL
	 - designed to scale out easily and kick out new db servers
	 - this is a randomly generated id so we don't need to check with the other servers to
	 find the highest  incrementing number is
	 - the object _id or 'oid' is made up of these parts:
	   - its a 12 byte value, the first 4bytes are a timestamp so a created_at field is not neaded.
	   the next  3bytes are a machine identifier, then 2bytes are a process id (just another way to
	   create a unique identifier) last is a 3byte counter like what MySQL would do
	 - We can specify a custom value for the oid and do anything we like for id creation but keep in
	 mind that we can add the same data twice

   -Object desctructoring:
   - lets you pull out properties from an object creating variables like this:
   //ES6: Object destructoring, if we want to pull out a value from this object and create a variable with it
   const user  = { name: 'joeybear', age: 777 };

   // We destructured the user object pulling out the name property, creating a new 'name' variable and set the value of it
   const { name } = user;
   console.log('name:', name);

   - Destructoring continued
   // const MongoClient = require('mongodb').MongoClient;
   const { MongoClient, ObjectID } = require('mongodb');
   // With destructoring we can create new objectIds whereever we want
   let obj = new ObjectID();
   console.log('obj: ', obj);

*/

// Mongo v2

/*

MongoClient.connect('mongodb://joeyAdmin:OjSqueaker2121@localhost:27017/Todos?authSource=admin', (err, client) => {
  if (err) {
	return console.log('Unable to connect to MongoDg server');
  }
  console.log('Connected to MongoDB server Success!');
  const db = client.db('Todos');

  db.collection('Todos').insertOne({
	text: 'Something to do',
	completed: false
  }, (err, result) => {
	if (err) {
	  return console.log('Unable to insert todo', err );
	}

	console.log(JSON.stringify(result.ops, undefined, 2));
  });

  client.close();
});

*/
