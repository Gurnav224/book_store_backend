const mongoose = require('mongoose');
const mockDb = require('./mockDb');

let isConnected = false;
let useMockDb = false;

console.log(process.env.MONGO_URI)

const connectDB = async () => {
  if (isConnected) {
    return { connected: true, mock: useMockDb };
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    useMockDb = false;
    return { connected: true, mock: false };
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Using mock database instead');
    isConnected = true;
    useMockDb = true;
    return { connected: true, mock: true };
  }
};

const getDb = () => {
  if (useMockDb) {
    return mockDb;
  }
  return mongoose;
};

module.exports = { connectDB, getDb, isMockDb: () => useMockDb };
