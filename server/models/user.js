const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt  = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
	type: String,
	required: true,
	trim: true,
	minlength: 4,
	unique: true,
	validate: {
	  validator: validator.isEmail,
	  message: '{VALUE} is not a valid email'
	}
  },
  password: {
	type: String,
	require: true,
	minlength: 7
  },
  tokens: [{
	access: {
	  type: String,
	  required: true
	},
	token: {
	  type: String,
	  required: true
	}
  }]
});

// We can overide a method to update how mongoose handles certain things
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};



UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{access, token}]);
  /*there are some inconsistencies accross diff mongoose versions so changed push() out for concat()
	   user.tokens.push({acess, token});
	*/
  return user.save().then(() => {
	return token;
  });

};

// $pull lets you remove items from an array that match a certain criteria
UserSchema.methods.removeToken = function (token) {
  const user = this;

  return user.update({
	$pull: {
	  tokens: { token }
	}
  });
};

UserSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;

  try {
	decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
	return Promise.reject();
  }

  return User.findOne({
	'_id': decoded._id,
	'tokens.token': token,
	'tokens.access': 'auth'
  });

};

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email }).then((user) => {
	if (!user) {
	  return Promise.reject();
	}

	return new Promise((resolve, reject) => {
	  bcrypt.compare(password, user.password, (err, res) => {
		if (res) {
		  resolve(user);
		} else {
		  reject();
		}

	  });
	});
  });

};



//mongoose-middleware (need access 'this' binding)
UserSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
	// user.password
	bcrypt.genSalt(10, (err, salt) => {
	  bcrypt.hash(user.password, salt, (err, hash) => {
		// set it user.password = hash;
		// console.log('hashed passwd: ', hash);
		bcrypt.compare(user.password, hash, (err, res) => {
		  // in this CB is where we get the hashed password
		  user.password = hash;
		  // console.log('res: ', res);
		next();
		});
	  });
	});

  } else {

	next();
  }
});


// create a model
const User = mongoose.model('User', UserSchema);


module.exports = { User };
