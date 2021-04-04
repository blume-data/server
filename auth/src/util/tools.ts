import {
  JWT_ID,
  JwtPayloadType,
  USER_NAME, ID,
  clientType, SESSION_ID
} from "@ranjodhbirkaur/common";

export function getClientPayload(jwtId: string, role: string, permissions: string[], applicationName: string, userName: string, clientUserName: string): JwtPayloadType {
  return {
    [JWT_ID]: jwtId,
    [clientType]: applicationName,
    [USER_NAME]: userName,
    [ID]: '',
    [SESSION_ID]: ''
  };
}