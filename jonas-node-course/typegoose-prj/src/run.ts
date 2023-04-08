import mongoose from 'mongoose';

async function run(...funcs: Function[]) {
  const mongoUri = 'mongodb://localhost:27017';
  await mongoose.connect(mongoUri, {
    dbName: 'typegoose_prj',
  });
  console.log('Connected to DB');

  for (const func of funcs) {
    await func();
  }
  await mongoose.disconnect();
}

export { run };
