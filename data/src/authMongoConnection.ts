import { Mongoose } from "mongoose";

import mongoose from 'mongoose';
if (!process.env.MONGO_URI_AUTH) {
    throw new Error('MONGO_URI && MONGO_URI_AUTH must be defined');
  }
export const authMongoConnection = mongoose.createConnection(process.env.MONGO_URI_AUTH, {
    useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
});