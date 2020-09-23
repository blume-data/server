import {
  APPLICATION_NAME,
  CLIENT_USER_NAME,
  JWT_ID,
  JwtPayloadType, PERMISSIONS, ROLE,
  USER_NAME
} from "@ranjodhbirkaur/common";

export function getClientPayload(jwtId: string, role: string, permissions: string[], applicationName: string, userName: string, clientUserName: string): JwtPayloadType {
  return {
    [JWT_ID]: jwtId,
    [ROLE]: role,
    [PERMISSIONS]: permissions,
    [CLIENT_USER_NAME]: clientUserName,
    [APPLICATION_NAME]: applicationName,
    [USER_NAME]: userName
  };
}