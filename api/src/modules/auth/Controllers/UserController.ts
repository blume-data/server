import {
    BadRequestError,
    okayStatus,
    JWT_ID,
    ID,
    RANDOM_STRING,
    CLIENT_USER_NAME,
    generateJwt,
    sendJwtResponse,
    LAST_NAME,
    FIRST_NAME,
    PASSWORD,
    EMAIL,
    PayloadResponseType, JwtPayloadType, SESSION_ID} from "../../../util/common-module";
import {ClientTempUser} from "../../../db-models/clientTempUser";
import {Request, Response} from "express";
import {TOKEN_NOT_VALID, USER_NAME_NOT_AVAILABLE} from "../util/errorMessages";
import {UserModel as MainUserModel} from "../../../db-models/UserModel";
import {EXAMPLE_APPLICATION_NAME} from "../util/constants";
import {createNewSession} from "../util/tools";
import { newApplicationSpace } from "../../model-collections/Controllers/ApplicationNameController";
import { clientUserType, USER_NAME, clientType } from "@ranjodhbirkaur/constants";
import {v4} from 'uuid';

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
                    userExist = await MainUserModel.findOne({userName: modelProps.userName});
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

    const clientUserExist = await MainUserModel.findOne({email: modelProps.email}, 'id');
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
            const uid = v4();

            if(userType === clientUserType) {
                const newUser = MainUserModel.build({
                    email: userExist[EMAIL],
                    jwtId,
                    id: uid,
                    createdAt: created_at,
                    password: userExist[PASSWORD],
                    firstName: userExist[FIRST_NAME],
                    lastName: userExist[LAST_NAME],
                    userName: userExist[USER_NAME],
                });
    
                await newUser.save();

                // Pass application names in response
                const response: PayloadResponseType = {
                    [CLIENT_USER_NAME]: newUser[USER_NAME],
                    [clientType]: userType,
                    [ID]: newUser[ID],
                    [USER_NAME]: newUser[USER_NAME]
                };

                // create a new session
                const newSession = await createNewSession({
                    req, responseData: response, existingUser: {jwtId, type: userType}
                });

                const payload: JwtPayloadType = {
                    [JWT_ID]: jwtId,
                    [ID]: newUser[ID],
                    userGroupIds: [''],
                    [USER_NAME]: newUser[USER_NAME] || '',
                    [clientType]: userType,
                    [SESSION_ID]: newSession._id || '',
                };

                // create a new example application space
                await OnCreateNewUser(newUser[ID], newUser.userName);

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

/*
* On create new user
* */
export async function OnCreateNewUser(userId: string, userName: string) {

    await newApplicationSpace({
        clientUserName: userName,
        applicationName: EXAMPLE_APPLICATION_NAME,
        userId,
        description: 'This is an example space',
    });
}


