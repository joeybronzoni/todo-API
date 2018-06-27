const mongoose = require('mongoose');

// create a model
let User = mongoose.model('Users', {
  email: {
	type: String,
	required: true,
	trim: true,
	minlength: 4
  }
});


module.exports = { User };
