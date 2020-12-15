import {
    BadRequestError,
    okayStatus,
    USER_NAME,
    clientUserType,
    JWT_ID,
    adminUserType,
    RANDOM_STRING,
    ClientUser,
    AdminUser,
    FreeUser,
    CLIENT_USER_NAME,
    APPLICATION_NAME,
    generateJwt,
    sendJwtResponse,
    clientType,
    freeUserType,
    LAST_NAME,
    FIRST_NAME,
    PASSWORD,
    EMAIL,
    APPLICATION_NAMES,
    PayloadResponseType, JwtPayloadType, EnglishLanguage, SESSION_ID
} from "@ranjodhbirkaur/common";
import {ClientTempUser} from "../models/clientTempUser";
import {Request, Response} from "express";
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
        // TODO check which properties to be taken from here
        const userExist = await ClientTempUser.findOne({email: modelProps.email, verificationToken: modelProps.token});

        if (userExist) {

            const jwtId = RANDOM_STRING(10);
            const created_at = `${new Date()}`;
            const userType = userExist.clientType;

            if(userType === freeUserType) {
                const newUser = FreeUser.build({
                    email: userExist[EMAIL],
                    jwtId,
                    created_at,
                    [CLIENT_USER_NAME]: userExist[CLIENT_USER_NAME] || '',
                    applicationName: '',
                    password: userExist[PASSWORD],
                    userName: userExist[USER_NAME],
                    clientType: freeUserType,
                    env: ''
                });
    
                await newUser.save();

                const response: PayloadResponseType = {
                    [SESSION_ID]: '',
                    [APPLICATION_NAMES]: [{
                        name: '',
                        languages: ['']
                    }],
                    [CLIENT_USER_NAME]: newUser[CLIENT_USER_NAME],
                    [USER_NAME]: newUser[USER_NAME],
                    [clientType]: freeUserType
                };

                const payload: JwtPayloadType = {
                    [JWT_ID]: newUser[JWT_ID],
                    [clientType]: freeUserType,
                    [USER_NAME]: newUser[USER_NAME]
                };

                return await sendValidateEmailResponse(req, payload, response, res);
            }
            else if(userType === clientUserType) {
                const applicationNames = [{
                    name: EXAMPLE_APPLICATION_NAME,
                    languages: [EnglishLanguage]
                }];
                const newUser = ClientUser.build({
                    email: userExist[EMAIL],
                    jwtId,
                    created_at,
                    [APPLICATION_NAMES]: JSON.stringify(applicationNames),
                    password: userExist[PASSWORD],
                    firstName: userExist[FIRST_NAME],
                    lastName: userExist[LAST_NAME],
                    userName: userExist[USER_NAME],
                });
    
                await newUser.save();

                // Pass application names in response
                const response: PayloadResponseType = {
                    [SESSION_ID]: '',
                    [CLIENT_USER_NAME]: newUser[USER_NAME],
                    [clientType]: userType,
                    [APPLICATION_NAMES]: applicationNames,
                    [USER_NAME]: newUser[USER_NAME]
                };

                const payload: JwtPayloadType = {
                    [JWT_ID]: jwtId,
                    [USER_NAME]: userExist[USER_NAME] || '',
                    [clientType]: userExist[clientType] || ''
                };

                return await sendValidateEmailResponse(req, payload, response, res);

            }
        }
        else {
            throw new BadRequestError(TOKEN_NOT_VALID);
        }
    }
};

/*Send response on email verification*/
async function sendValidateEmailResponse(req: Request, payload: JwtPayloadType, responseData: PayloadResponseType, res: Response) {

    const modelProps = req.query;
    // Generate JWT
    const userJwt = generateJwt(payload, res);

    // TODO delete user in temp collection
    //const okDeleted = await ClientTempUser.deleteMany({email: modelProps.email});

    return sendJwtResponse(res, responseData, userJwt);
}


