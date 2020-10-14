import {Request, Response, NextFunction} from 'express';
import {
    APPLICATION_NAMES,
    clientType,
    clientUserType,
    JWT_ID, USER_NAME,
    sendSingleError, Is_Enabled,
} from "@ranjodhbirkaur/common";
import jwt from 'jsonwebtoken';
import {AUTHORIZATION_TOKEN} from "../util/constants";
import {ClientUserModel} from "../authMongoConnection";

/*
* Check isEnabled jwt_id and client type
* */
export async function checkAuth(req: Request, res: Response, next: NextFunction ) {


    /*Send Not Authorised Response*/
    function notAuthorized() {
        sendSingleError(res, 'Not authorised');
    }

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
        else {
            return notAuthorized();
        }

        // check if the jwt_id matches
        if(payload && payload[JWT_ID] && payload[clientType] && payload[USER_NAME]) {
            switch (payload[clientType]) {
                case clientUserType: {
                    const userExist = await ClientUserModel.findOne({
                        [USER_NAME]: payload[USER_NAME], [JWT_ID]: payload[JWT_ID], [Is_Enabled]: true
                    }, [JWT_ID, APPLICATION_NAMES, Is_Enabled]);

                    if(userExist && userExist[APPLICATION_NAMES]) {
                        const applicationNames = JSON.parse(userExist[APPLICATION_NAMES]);
                        req.currentUser = {
                            [USER_NAME]: payload[USER_NAME],
                            [APPLICATION_NAMES]: applicationNames,
                            [clientType]: payload[clientType]
                        };
                        next();
                    }
                    else {
                        return notAuthorized();
                    }
                    break;
                }
            }

        }

    }
    catch (e) {
        if (process.env.NODE_ENV === 'test') {
            return next();
        }
        return notAuthorized();
    }
}