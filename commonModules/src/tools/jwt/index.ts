import {Request, Response} from 'express';
import jwt from "jsonwebtoken";
import {AUTHORIZATION_TOKEN, AUTH_TOKEN, okayStatus, USER_NAME} from "../../utils";

interface userType {
    id?: string;
    email?: string;
    userName?: string;
}

export function generateJwt(payload: object, req: Request) {
    // Generate JWT
    const userJwt = jwt.sign(
        payload,
        process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
        jwt: userJwt,
    };
    return userJwt;
}

export function sendJwtResponse(res: Response, payload: object, userJwt: string, existingUser: userType) {
    return res.status(okayStatus).send({...payload, [AUTH_TOKEN]: userJwt, [USER_NAME]: existingUser.userName});
}

export function verifyJwt(req: Request) {
    const headers: any = req.headers;
    try {
        const payload = jwt.verify(
            headers[AUTHORIZATION_TOKEN],
            process.env.JWT_KEY!
        );
        return payload;
    } catch (error) {
        return false;
    }
}