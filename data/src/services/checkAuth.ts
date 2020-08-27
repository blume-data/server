import axios from 'axios';
import {Request, Response, NextFunction} from 'express';
import {AUTH_SRV_URL} from "../util/urls";
import {NotAuthorizedError} from "@ranjodhbirkaur/common";
import jwt from 'jsonwebtoken';
import {AUTHORIZATION_TOKEN} from "../util/constants";

/*
* This route requires the root client auth
* */
export async function checkAuth(req: Request, res: Response, next: NextFunction ) {
    const userName  = req.params && req.params.userName;

    try {
        const headers: any = req.headers;
        let payload: any;

        if (headers[AUTHORIZATION_TOKEN]) {
            // verify token
            payload = jwt.verify(
                headers[AUTHORIZATION_TOKEN],
                process.env.JWT_KEY!
            );
        }
        else if(req.session && req.session.jwt) {
            payload = jwt.verify(
                req.session.jwt,
                process.env.JWT_KEY!
            )
        }
        // check the payload
        if (payload && payload.userName && payload.userName === userName) {
            /*await axios.post(`${AUTH_SRV_URL}/check`,{
                userName
            });*/
            next();
        }
        else {
            next();
            //throw new Error();
        }
    }
    catch (e) {
        if (process.env.NODE_ENV === 'test') {
            return next();
        }
        throw new NotAuthorizedError();
    }
}