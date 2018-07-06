const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });
let env  = process.env.NODE_ENV || 'development' || 'mlab';


mongoose.Promise = global.Promise;

// After adding a remote db env I moved my basic connect to an if/else statement to handle the envs. Not because I had too but because I am just tinkering with multiple envs
// mongoose.connect(process.env_node.MONGODB_URI);
// mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE || process.env.REMOTE_DATABASE);
// mongoose.connect('mongodb://localhost:27017/TodoApp');


if (env === 'mlab') {
mongoose.connect(process.env.REMOTE_DATABASE);
} else if (env === 'development') {
mongoose.connect(process.env.DATABASE);
} else {
mongoose.connect(process.env.MONGODB_URI);
}

module.exports = { mongoose };


// process.env.NODE_ENV
