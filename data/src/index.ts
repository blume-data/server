import mongoose from 'mongoose';
import { app } from './app';
import {getMongoDatabaseUrl, mongoConnectOptions} from "@ranjodhbirkaur/common";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  const MONGO_URL = getMongoDatabaseUrl();
  try {
    await mongoose.connect(MONGO_URL, mongoConnectOptions);
    console.log('Data Service: Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Data Service: Server is Listening!');
  });
};

start().then(() => console.log('started Everything'));
