const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) throw new Error('DB_URI is not defined');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('MongoDB connected:', mongoose.connection.host);
}

module.exports = connectDB;
