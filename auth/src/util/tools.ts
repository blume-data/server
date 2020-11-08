import {
  JWT_ID,
  JwtPayloadType,
  USER_NAME,
  clientType
} from "@ranjodhbirkaur/common";

export function getClientPayload(jwtId: string, role: string, permissions: string[], applicationName: string, userName: string, clientUserName: string): JwtPayloadType {
  return {
    [JWT_ID]: jwtId,
    [clientType]: applicationName,
    [USER_NAME]: userName
  };
}