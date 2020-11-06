import mongoose, {Connection} from 'mongoose';
import {getClientUserModel} from "@ranjodhbirkaur/common";
if (!process.env.MONGO_STORE_URI) {
    throw new Error('MONGO_URI && MONGO_STORE_URI must be defined');
  }
export const storeMongoConnection = mongoose.createConnection(process.env.MONGO_STORE_URI, {
    useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
});

/*export function getClientUserModel(connection: Connection) {
    return connection.model<ClientUserDoc, ClientUserModel>('ClientUser', clientUserSchema);
}*/

export const DataStoreModel = getClientUserModel(storeMongoConnection);