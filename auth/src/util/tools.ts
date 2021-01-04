import {
  JWT_ID,
  JwtPayloadType,
  USER_NAME,
  clientType
} from "@ranjodhbirkaur/common";
import mongoose from "mongoose";
import {getMongoDatabaseUrl, mongoConnectOptions} from "@ranjodhbirkaur/common";

export function getClientPayload(jwtId: string, role: string, permissions: string[], applicationName: string, userName: string, clientUserName: string): JwtPayloadType {
  return {
    [JWT_ID]: jwtId,
    [clientType]: applicationName,
    [USER_NAME]: userName
  };
}

const MONGO_URL = getMongoDatabaseUrl();
export const MongoConnection = mongoose.createConnection(MONGO_URL, mongoConnectOptions);