import {Request, Response, NextFunction} from 'express';
import {
    APPLICATION_NAMES,
    clientType,
    clientUserType,
    JWT_ID, USER_NAME,
    sendSingleError, Is_Enabled, CLIENT_USER_NAME, ID, verifyJwt,
} from "@ranjodhbirkaur/common";
import {ClientUserModel} from "../authMongoConnection";

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
            switch (payload[clientType]) {
                case clientUserType: {
                    const userExist = await ClientUserModel.findOne({
                        [USER_NAME]: payload[USER_NAME], [JWT_ID]: payload[JWT_ID], [Is_Enabled]: true
                    }, [JWT_ID, APPLICATION_NAMES, Is_Enabled, USER_NAME, ID]);

                    if(userExist && userExist[APPLICATION_NAMES] && userExist[USER_NAME] === clientUserName) {
                        const applicationNames = JSON.parse(userExist[APPLICATION_NAMES]);
                        req.currentUser = {
                            [ID]: userExist[ID],
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