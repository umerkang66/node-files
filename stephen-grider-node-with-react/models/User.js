const mongoose = require('mongoose');

// Creating the schema
const userSchema = new mongoose.Schema({
  googleId: String,
});

userSchema.index({ googleId: 1 });

// Creating the model (collection) out of schema
mongoose.model('users', userSchema);
