const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = connectDB;
