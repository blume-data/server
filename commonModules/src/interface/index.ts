export interface ErrorMessages {
    field?: string;
    message: string;
}

export interface JwtPayloadType {
    userName: string;
    jwtId: string;
}

export interface ClientUserJwtPayloadType extends JwtPayloadType{
    clientUserName: string;
    applicationName: string;
    clientType: string;
}
