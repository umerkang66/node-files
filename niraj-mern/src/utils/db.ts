import mongoose from 'mongoose';

async function connectToDb() {
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    throw new Error('DB Url is not defined');
  }

  try {
    await mongoose.connect(dbUrl);
    console.log('🚀', 'Connected to db');
  } catch (err) {
    console.log('✨✨✨', 'Error connecting to db');
    console.error(err);
  }
}

export { connectToDb };
