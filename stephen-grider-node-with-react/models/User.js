const mongoose = require('mongoose');

// Creating the schema
const userSchema = new mongoose.Schema({
  email: String,
  googleId: String,
  credits: {
    type: Number,
    default: 0,
  },
});

userSchema.index({ googleId: 1 });

// Creating the model (collection) out of schema
mongoose.model('users', userSchema);
