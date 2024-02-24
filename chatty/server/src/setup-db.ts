import mongoose from 'mongoose';
import { config } from './config';

export function setupDb() {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL)
      .then(() => console.log('Successfully connected to database'))
      .catch(() => {
        console.log('Error connecting to database');
        return process.exit(1);
      });
  };

  connect();

  // whenever the disconnected event will be called, try to connect again
  mongoose.connection.on('disconnected', connect);
}
