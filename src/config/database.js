const mongoose = require('mongoose');
const config = require('./config');

// Configure mongoose for serverless
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    // If already connected, return existing connection
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Using existing MongoDB connection');
      return mongoose.connection;
    }

    // If connecting, wait for it
    if (mongoose.connection.readyState === 2) {
      console.log('⏳ Waiting for MongoDB connection...');
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
      return mongoose.connection;
    }

    // Serverless-optimized connection options
    const options = {
      bufferCommands: false, // Disable buffering for serverless
      maxPoolSize: 10, // Limit connection pool size
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    };

    const conn = await mongoose.connect(config.mongodb.uri, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown (only for non-serverless environments)
    if (process.env.VERCEL !== '1') {
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      });
    }

    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Don't exit in serverless - throw error instead
    if (process.env.VERCEL === '1') {
      throw error;
    }
    process.exit(1);
  }
};

module.exports = connectDB;
