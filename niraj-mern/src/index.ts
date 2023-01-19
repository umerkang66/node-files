import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { connectToDb } from './utils/db';

async function start() {
  if (
    !process.env.JWT_KEY ||
    !process.env.JWT_EXPIRES_IN ||
    !process.env.JWT_COOKIE_EXPIRES_IN
  ) {
    throw new Error(
      'JWT_KEY, or JWT_EXPIRES_IN, or JWT_COOKIE_EXPIRES_IN is not defined'
    );
  }
  if (!process.env.DB_URL) {
    throw new Error('DB_URL is not defined');
  }
  await connectToDb();

  const port = process.env.PORT || 3001;
  if (!port) {
    throw new Error('PORT is not defined');
  }

  app.listen(port, () => {
    console.log(`🚀 App is listening on port ${port}`);
  });
}

start();
