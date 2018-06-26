// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });


MongoClient.connect(process.env.DATABASE, (err, db) => {
  if (err) {
	return console.log('Unable to connect to MongoDg server');
  }
  console.log('Connected to MongoDB server Success!');


  db.collection('Users').findOneAndUpdate({
	_id: new ObjectID('5b3178572fbafc467bde6882')
  }, {

	$set: {
	  name: 'jimmyDean'
	},
	$inc: {
	  age: +2
	}
  }, {
	returnOriginal: false
  }).then((result) => {
	console.log(result);
  });


  // db.close();
});


// Updating Records:
/* update()
   -findOneAndUpdate(filter, update, options, callback)
     - findOneAndUpdate() takes a few different arguments

	  -(filter) lets us target the document we want to update. If we have the text or
	  more likely the _id of the document

	  -(update) this returns a boolean and updates the fact that we updated the
	  document, it completes

	  -(options) are [projection, sort, maxTimeMS, upsert and returnOriginal]
	  *!*!-note: read more about the options dummy
	  - (callback), if you don't know what a callback is by now then why are you even
	  trying? But what's important is that we will leave off the callback in favor of promises
   -This method returns a promise if no callback was passed in, as expected
   - after the filter arg we pass a MongoDB operators like $set or $rename

     -(operators):
	   -*note, these should work with all drivers as it is specific to mongodb-docs,
	   - $set: lets us 'set'  a fields value inside our update
	   - $inc: lets us increment a fields value, like i.e -age
	   - $mul:
	   -$rename:
	   -$setOnInsert:
	   -$min:
	   -$max;
	   -MANYMORE

	 -(returnOriginal): defalualed to true which returns the original document
	   -We want to return the updated set this to false
	 -tac on a .then() for to return our result
*/
