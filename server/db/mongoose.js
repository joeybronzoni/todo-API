const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

mongoose.Promise = global.Promise;
// mongoose.connect(process.env_node.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE);
// mongoose.connect('mongodb://localhost:27017/TodoApp');


module.exports = { mongoose };


// process.env.NODE_ENV
