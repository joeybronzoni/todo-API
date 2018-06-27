const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE);
mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE);
// mongoose.connect('mongodb://localhost:27017/TodoApp');


module.exports = { mongoose };


/*MONGODB_URI: mongodb://heroku_4cq11pqb:i378qbvo9tookvam70e509q0et@ds131139.mlab.com:31139/heroku_4cq11pqb*/
