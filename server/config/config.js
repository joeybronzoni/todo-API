require('dotenv').config({ path: 'variables.env' });
let env  = process.env.NODE_ENV || 'development' || 'mlab';
console.log('env*****: ', env);

if (env === 'development' || env === 'test' || env === 'mlab') {
  const config = require('./config.json');
  const envConfig = config[env];

  // loop over config.json object and grab the keys and use the appropriate one
  Object.keys(envConfig).forEach((key) => {
	process.env[key] = envConfig[key];
  });

}

//Refer to -notes to find heroko dev env commands

// if (env === 'development') {
//   process.env.PORT;
//   process.env.MONGODB_URI = process.env.DATABASE;
// } else if (env === 'test') {
//   process.env.PORT;
//   process.env.MONGODB_URI = process.env.TESTDATABASE;
// }
