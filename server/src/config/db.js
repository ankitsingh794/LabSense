import mongoose from 'mongoose';
const { connection, connect } = mongoose;
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    // Attach event listeners BEFORE connecting
    connection.on('connected', () => {
      logger.info('✅ Mongoose connected to DB');
    });

    connection.on('error', (err) => {
      logger.error(`❌ Mongoose connection error: ${err.message}`);
    });

    connection.on('disconnected', () => {
      logger.warn('⚠️ Mongoose disconnected from DB');
    });

    process.on('SIGINT', async () => {
      await connection.close();
      info('🔌 MongoDB connection closed due to app termination');
      process.exit(0);
    });

    // Connect after listeners are attached
    await connect(process.env.MONGO_URI);

  } catch (err) {
    logger.error(`❌ Initial MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
