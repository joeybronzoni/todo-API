require('dotenv').config({ path: 'variables.env' });
let env  = process.env.NODE_ENV || 'development';
console.log('env*****: ', env);

if (env === 'development') {
  process.env.PORT;
  process.env.MONGODB_URI = process.env.DATABASE;
} else if (env === 'test') {
  process.env.PORT;
  process.env.MONGODB_URI = process.env.TESTDATABASE;
}
