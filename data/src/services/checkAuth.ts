import axios from 'axios';
import {Request, Response, NextFunction} from 'express';
import {AUTH_SRV_URL} from "../util/urls";
import {clientType, ClientUser, clientUserType, NotAuthorizedError} from "@ranjodhbirkaur/common";
import jwt from 'jsonwebtoken';
import {AUTHORIZATION_TOKEN} from "../util/constants";
import { authMongoConnection } from '../authMongoConnection';

/*
* This route requires the root client auth
* */
export async function checkAuth(req: Request, res: Response, next: NextFunction ) {
    const clientUserName  = req.params && req.params.clientUserName;

    next()
    /*try {
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
        else {
            throw new Error();
        }
        // check the payload
        if (payload && payload[clientType] && (payload.userName === clientUserName || payload.clientUserName === clientUserName)) {
            switch(payload[clientType]) {
                case clientUserType: {
                    const exist = ClientUser.findOne({userName: clientUserName});
                }
            }
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
    }*/
}