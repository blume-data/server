import {Request, Response} from 'express';
import jwt from "jsonwebtoken";
import {AUTH_TOKEN, AUTHORIZATION_TOKEN, JWT_COOKIE_NAME, JWT_KEY, okayStatus} from "../../utils";
import {JwtPayloadType, PayloadResponseType} from "../../interface";

export function generateJwt(payload: JwtPayloadType, res: Response) {

    return jwt.sign(
        payload,
        JWT_KEY
    );
}

export function sendJwtResponse(res: Response, payload: PayloadResponseType, userJwt: string) {
    return res.status(okayStatus).send({...payload, [AUTH_TOKEN]: userJwt});
}

export function verifyJwt(req: Request) {
    const headers: any = req.headers;
    let payload: any;
    try {
        if(headers[AUTHORIZATION_TOKEN]) {
            payload = jwt.verify(
                headers[AUTHORIZATION_TOKEN],
                JWT_KEY!
            );

        }
        else if(req.cookies && req.cookies[JWT_COOKIE_NAME]) {
            payload = jwt.verify(
                req.cookies[JWT_COOKIE_NAME],
                JWT_KEY!
            )
        }
        return payload;
    } catch (error) {
        return false;
    }
}