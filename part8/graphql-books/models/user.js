const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
