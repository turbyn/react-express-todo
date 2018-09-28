const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  userName: {
    type: String,
    default: '',
  },
  categories: {
    type: [String],
    default: ['Work', 'School', 'Home'],
  },
});

mongoose.model('users', userSchema);
