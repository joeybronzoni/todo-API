// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });


MongoClient.connect(process.env.DATABASE, (err, db) => {
  if (err) {
	return console.log('Unable to connect to MongoDg server');
  }
  console.log('Connected to MongoDB server Success!');


  db.close();
});
