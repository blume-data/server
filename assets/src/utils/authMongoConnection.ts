import mongoose from 'mongoose';
import {getClientUserModel} from "@ranjodhbirkaur/common";

if (!process.env.MONGO_URI_AUTH) {
    throw new Error('MONGO_URI && MONGO_URI_AUTH must be defined');
}
export const authMongoConnection = mongoose.createConnection(process.env.MONGO_URI_AUTH, {
    useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
});

export const ClientUserModel = getClientUserModel(authMongoConnection);