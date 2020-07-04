import mongoose from 'mongoose';

import { app } from './app';
import {MONGO_DB_DATA_CONNECTIONS_AVAILABLE} from "./util/constants";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if(!(MONGO_DB_DATA_CONNECTIONS_AVAILABLE && MONGO_DB_DATA_CONNECTIONS_AVAILABLE.length)) {
    throw new Error('Mongo db connections not available');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      //poolSize: MONGO_DB_DATA_CONNECTIONS_AVAILABLE.length
    });
    console.log('Data Service: Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Data Service: Server is Listening');
  });
};

start();
