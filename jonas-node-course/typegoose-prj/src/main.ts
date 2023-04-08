import mongoose from 'mongoose';

async function run<T extends () => Promise<void> | void>(func: T) {
  const mongoUri = 'mongodb://localhost:27017';
  await mongoose.connect(mongoUri, {
    dbName: 'typegoose_prj',
  });
  console.log('Connected to DB');

  await func();
  await mongoose.disconnect();
}

const umer = () => console.log('kang did this');

run(umer);
