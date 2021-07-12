import {Request, Response, NextFunction} from 'express';
import {
    JWT_ID,
    sendSingleError, Is_Enabled, CLIENT_USER_NAME, ID, verifyJwt,
} from "../util/common-module";
import {UserModel} from "../db-models/UserModel";
import { clientType, clientUserType, USER_NAME } from '@ranjodhbirkaur/constants';

/*
* Check isEnabled jwt_id and client type
* */
export async function checkAuth(req: Request, res: Response, next: NextFunction ) {


    const clientUserName = req.params[CLIENT_USER_NAME];

    /*Send Not Authorised Response*/
    function notAuthorized() {
        sendSingleError(res, 'Not authorised');
    }

    try {
        const payload = verifyJwt(req);
        if(!payload) {
            return notAuthorized();
        }

        // check if the jwt_id matches
        if(payload && payload[JWT_ID] && payload[clientType] && payload[USER_NAME]) {
            const userExist = await UserModel.findOne({
                [USER_NAME]: payload[USER_NAME], [JWT_ID]: payload[JWT_ID], [Is_Enabled]: true
            }, [JWT_ID, Is_Enabled, USER_NAME, 'id', 'userGroupIds']);

            if(userExist && userExist[USER_NAME] === clientUserName) {
                req.currentUser = {
                    userGroupIds: userExist.userGroupIds,
                    id: userExist.id,
                    [USER_NAME]: payload[USER_NAME],
                    [clientType]: payload[clientType]
                };
                next();
            }
            else {
                return notAuthorized();
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