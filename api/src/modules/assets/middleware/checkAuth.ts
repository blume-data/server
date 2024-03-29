import {Request, Response, NextFunction} from 'express';
import {
    APPLICATION_NAMES,
    JWT_ID, 
    sendSingleError, Is_Enabled, CLIENT_USER_NAME, ID, JWT_KEY, NOT_AUTHORISED_STATUS,
} from "../../../util/common-module";
import jwt from 'jsonwebtoken';
import {UserModel} from "../../../db-models/UserModel";
import {USER_NAME, AUTHORIZATION_TOKEN,clientType,clientUserType,} from '@ranjodhbirkaur/constants'

/*
* Check isEnabled jwt_id and client type
* */
export async function checkAuth(req: Request, res: Response, next: NextFunction ) {


    const clientUserName = req.params[CLIENT_USER_NAME];
    /*Send Not Authorised Response*/
    function notAuthorized() {
        sendSingleError({
            res,
            message: 'Not authorised',
            code: NOT_AUTHORISED_STATUS
        });
    }

    try {
        const headers: any = req.headers;
        let payload: any;

        if (headers[AUTHORIZATION_TOKEN]) {
            // verify token
            payload = jwt.verify(
                headers[AUTHORIZATION_TOKEN],
                JWT_KEY
            );
        }
        else if(req.session && req.session.jwt) {
            payload = jwt.verify(
                req.session.jwt,
                JWT_KEY
            )
        }
        else {
            return notAuthorized();
        }

        // check if the jwt_id matches
        if(payload && payload[JWT_ID] && payload[clientType] && payload[USER_NAME]) {
            switch (payload[clientType]) {
                case clientUserType: {
                    const userExist = await UserModel.findOne({
                        [USER_NAME]: payload[USER_NAME], [JWT_ID]: payload[JWT_ID], [Is_Enabled]: true
                    }, [JWT_ID, APPLICATION_NAMES, Is_Enabled, USER_NAME, ID]);

                    if(userExist && userExist[USER_NAME] === clientUserName) {
                        req.currentUser = {
                            [ID]: userExist[ID],
                            [USER_NAME]: payload[USER_NAME],
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
        return notAuthorized();
    }
}