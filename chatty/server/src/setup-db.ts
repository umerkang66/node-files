import mongoose from 'mongoose';

export function setupDb() {
  const connect = () => {
    mongoose
      .connect('mongodb://localhost:27017/chatty-server')
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
