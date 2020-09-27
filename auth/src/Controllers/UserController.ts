import {Request, Response} from 'express';
import {
    BadRequestError,
    okayStatus,
    USER_NAME,
    clientUserType,
    JWT_ID,
    adminUserType,
    RANDOM_STRING, ClientUser, AdminUser, FreeUser,
    CLIENT_USER_NAME,
    APPLICATION_NAME,
    generateJwt,
    sendJwtResponse, clientType, freeUserType, LAST_NAME, FIRST_NAME, PASSWORD, EMAIL
} from "@ranjodhbirkaur/common";
import {ClientTempUser} from "../models/clientTempUser";

import {TOKEN_NOT_VALID, USER_NAME_NOT_AVAILABLE} from "../util/errorMessages";
import {EXAMPLE_APPLICATION_NAME} from "../util/constants";

interface ReqIsUserNameAvailable extends Request{
    body: {
        userName: string
    },
}

interface ReqValidateEmail extends Request{
    query: {
        email: string,
        token: string
    },
}

export const isUserNameAvailable = async function (req: ReqIsUserNameAvailable, res: Response) {
    const modelProps = req.body;
    const userType = req.params.userType;
    
    if (modelProps) {
        if (modelProps.userName) {
            let userExist;

            switch (userType) {
                case clientUserType: {
                    userExist = await ClientUser.findOne({userName: modelProps.userName});
                    break;
                }
                case adminUserType: {
                    userExist = await AdminUser.findOne({userName: modelProps.userName});
                    break;
                }
            }
            if (userExist) {
                throw new BadRequestError(USER_NAME_NOT_AVAILABLE);
            }
            else {
                res.status(okayStatus).send(true);
            }
        }
    }
};

export const verifyEmailToken = async function (req: ReqValidateEmail, res: Response) {
    const modelProps = req.query;

    const clientUserExist = await ClientUser.findOne({email: modelProps.email});
    if (clientUserExist) {
        throw new BadRequestError('Invalid Request');
    }
    else {
        const userExist = await ClientTempUser.findOne({email: modelProps.email, verificationToken: modelProps.token});

        if (userExist) {

            const jwtId = RANDOM_STRING(10);
            const created_at = `${new Date()}`;
            const userType = userExist.clientType;
            let payload = {};
            let existingUsersUserName = '';
        


            if(userType === freeUserType) {
                const newUser = FreeUser.build({
                    email: userExist[EMAIL],
                    jwtId,
                    created_at,
                    [CLIENT_USER_NAME]: userExist[CLIENT_USER_NAME] || '',
                    applicationName: '',
                    password: userExist[PASSWORD],
                    userName: userExist[USER_NAME],
                    clientType: freeUserType
                });
    
                await newUser.save();

                payload = {
                    ...payload,
                    [clientType]: freeUserType,
                    [USER_NAME]: newUser[USER_NAME]
                };
                existingUsersUserName = newUser[USER_NAME];
            }
            else if(userType === clientUserType) {
                const newUser = ClientUser.build({
                    email: userExist[EMAIL],
                    jwtId,
                    created_at,
                    applicationNames: JSON.stringify([EXAMPLE_APPLICATION_NAME]),
                    password: userExist[PASSWORD],
                    firstName: userExist[FIRST_NAME],
                    lastName: userExist[LAST_NAME],
                    userName: userExist[USER_NAME],
                });
    
                await newUser.save();
    
                payload = {
                    ...payload,
                    [clientType]: clientUserType,
                    [USER_NAME]: newUser[USER_NAME]
                };
                existingUsersUserName = newUser[USER_NAME];
            }

            payload = {
                ...payload,
                [JWT_ID]: jwtId,
                [CLIENT_USER_NAME]: userExist[CLIENT_USER_NAME] || '',
                [APPLICATION_NAME]: userExist[APPLICATION_NAME] || ''
            }

            // Generate JWT
            const userJwt = generateJwt(payload, req);

            ClientTempUser.deleteMany({email: modelProps.email}).then(() => {});

            return sendJwtResponse(res, payload, userJwt, {userName: existingUsersUserName || ''});

        }
        else {
            throw new BadRequestError(TOKEN_NOT_VALID);
        }
    }
};


