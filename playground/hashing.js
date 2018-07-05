const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
  id: 10
};
const token = jwt.sign(data, '123abc');
console.log(token);
//

var decoded = jwt.verify(token, '123abc');
console.log(decoded);


// // to hash a variable pass it into the SHA256 function
// let message = 'I am user number 3';

// let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hassh: ${hash}`);

// // we get the id of user
//  data = {
//   id: 4
// };

// // we pass the data and pass the return value of the SHA256() function as the token
//  token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // man in the middle trickory
// //token.data.id = 5;
// //token.hash =SHA256(JSON.stringify(token.data)).toString();

// // For further protection we add salt to the hash(add something unique)
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }



/* hashing is a one way algorith, we get the same hash value for the same
   variable that we pass in to the SHA256();
   - this won't protect us in the middle of transactions,we will use https for that
   - we use hashing so that if changes are made we can deny the user
   - there is a whole standard that's called jsonwebtoken
     - jwt.sign: takes the obj and signs it, creates the hash
     - jwt.verify: takes the obj and makes sure its validated
     -!*! 3 parts to a jwt (look at https:jwt.io)
       -Header, Payload, anhd the verify signature
      -if you change the secret or the token we get an error
       -var decoded = jwt.verify(token + '1', '123abc');
       -var decoded = jwt.verify(token, '123abcc');
*/




// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
