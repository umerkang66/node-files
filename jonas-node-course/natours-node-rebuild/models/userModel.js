const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    // This will automatically convert it to lowerCase
    lowercase: true,
    // isEmail is a function, but we don't have to call it
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  // Photo is not required
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // Explanation of this in tourModel, this is only going to work on modelInstance.save() and Model.create(), for this reason, when we have to update a user, we always have to call save() (this does not work on findOneAndUpdate() and findByIdAndUpdate())
      validator: function (passwordConfirm) {
        return this.password === passwordConfirm;
      },
      message: 'Password should be equal to password confirm',
    },
  },
});

// MONGOOSE MIDDLEWARES: Explanations are in TourModel file
// Pre save middleware, to encrypt the password
userSchema.pre('save', async function (next) {
  // We only want to encrypt the password if the password field is actually updated, we can check this by checking isNew property on password (that should be true, if it is updated), for example if the user is updating the email, then we don't want to encrypt the password again

  // If the password is not modified, just call the next middleware
  if (!this.isModified('password')) {
    return next();
  }

  // HASHING THE PASSWORD
  // Bcryptjs is first going to salt the password (it is going to add a string to the password), so that the two equal passwords, should not look same after hashing
  // The second Argument is cost parameter, means how cpu intensive this operation should be (the more the number, the more the cpu intensive, more the secure password). The number "12" is considered as the safe value
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm, because we don't want to persist it to the DB, passwordConfirm is only required input (not actually required for DB)
  // By setting it to undefined, it will automatically not save in DB
  this.passwordConfirm = undefined;

  // Make sure to call next
  next();
});

// Creating the modelClass out of schema
const User = mongoose.model('users', userSchema);

module.exports = User;
