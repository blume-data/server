import mongoose from 'mongoose';

import { app } from './app';
import {getMongoDatabaseUrl, mongoConnectOptions} from "@ranjodhbirkaur/common";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    const MONGO_URL = getMongoDatabaseUrl();
    await mongoose.connect(MONGO_URL, mongoConnectOptions);
    console.log('Assets Service: Connected to MongoDb!');
  } catch (err) {
    console.error(err);
  }
// image kit requests
// allow cross-origin requests
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.listen(3000, () => {
    console.log('Assets Service: Server is Listening!');
  });
};

start();
