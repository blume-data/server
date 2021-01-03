import {
  JWT_ID,
  JwtPayloadType,
  USER_NAME,
  clientType
} from "@ranjodhbirkaur/common";
import mongoose from "mongoose";

export function getClientPayload(jwtId: string, role: string, permissions: string[], applicationName: string, userName: string, clientUserName: string): JwtPayloadType {
  return {
    [JWT_ID]: jwtId,
    [clientType]: applicationName,
    [USER_NAME]: userName
  };
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI && MONGO_URI must be defined');
}

export const MongoConnection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});