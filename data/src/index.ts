import mongoose from 'mongoose';

import { app } from './app';
import {initClientDbConnection} from "./util/connections";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('Data Service: Connected to MongoDb');
    await initClientDbConnection(() => {
      console.log('all connections were created');
    });
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Data Service: Server is Listening');
  });
};

start().then(() => console.log('started Everything'));
