import {Request, Response} from 'express';
import jwt from "jsonwebtoken";
import {AUTHORIZATION_TOKEN, AUTH_TOKEN, okayStatus, USER_NAME, JWT_COOKIE_NAME} from "../../utils";
import {JwtPayloadType, PayloadResponseType} from "../../interface";

export function generateJwt(payload: JwtPayloadType, res: Response) {
    // Generate JWT
    const userJwt = jwt.sign(
        payload,
        process.env.JWT_KEY!
    );

    // Store it on session object
    res.cookie(JWT_COOKIE_NAME, userJwt, { maxAge: 99999999*999999, httpOnly: true });
    return userJwt;
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
                process.env.JWT_KEY!
            );

        }
        else if(req.cookies && req.cookies[JWT_COOKIE_NAME]) {
            payload = jwt.verify(
                req.cookies[JWT_COOKIE_NAME],
                process.env.JWT_KEY!
            )
        }
        return payload;
    } catch (error) {
        return false;
    }
}