import mongoose from 'mongoose';
import {getClientUserModel, mongoConnectOptions, getMongoDatabaseUrl} from "@ranjodhbirkaur/common";

const MONGO_URL = getMongoDatabaseUrl();
export const authMongoConnection = mongoose.createConnection(MONGO_URL, mongoConnectOptions);

export const ClientUserModel = getClientUserModel(authMongoConnection);