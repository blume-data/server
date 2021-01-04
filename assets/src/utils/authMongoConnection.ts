import mongoose from 'mongoose';
import {getClientUserModel, getMongoDatabaseUrl, mongoConnectOptions} from "@ranjodhbirkaur/common";

const MONGO_URL = getMongoDatabaseUrl();
export const authMongoConnection = mongoose.createConnection(MONGO_URL, mongoConnectOptions);

export const ClientUserModel = getClientUserModel(authMongoConnection);