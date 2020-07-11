import axios from 'axios';
import {Request, Response, NextFunction} from 'express';
import {AUTH_SRV_URL} from "../util/urls";
import {NotAuthorizedError} from "@ranjodhbirkaur/common";
import jwt from 'jsonwebtoken';
import {AUTHORIZATION_TOKEN} from "../util/constants";

export async function checkAuth(req: Request, res: Response, next: NextFunction ) {
    const userName  = req.params && req.params.userName;

    try {
        const headers: any = req.headers;
        // verify token
        const payload: any = jwt.verify(
            headers[AUTHORIZATION_TOKEN],
            process.env.JWT_KEY!
        );
        // check the payload
        if (payload && payload.userName && payload.userName === userName) {
            await axios.post(`${AUTH_SRV_URL}/check`,{
                userName
            });
            next();
        }
        else {
            throw new Error();
        }
    }
    catch (e) {
        throw new NotAuthorizedError();
    }
}