import {
    BadRequestError,
    okayStatus,
    USER_NAME,
    clientUserType,
    JWT_ID,
    ID,
    RANDOM_STRING,
    CLIENT_USER_NAME,
    generateJwt,
    sendJwtResponse,
    clientType,
    LAST_NAME,
    FIRST_NAME,
    PASSWORD,
    EMAIL,
    PayloadResponseType, JwtPayloadType, SESSION_ID
} from "@ranjodhbirkaur/common";
import {ClientTempUser} from "../models/clientTempUser";
import {Request, Response} from "express";
import {TOKEN_NOT_VALID, USER_NAME_NOT_AVAILABLE} from "../util/errorMessages";
import {UserModel as MainUserModel} from "../models/UserModel";
import {DateTime} from "luxon";
import {ApplicationSpaceModel} from "../models/ApplicationSpace";
import {EXAMPLE_APPLICATION_NAME} from "../util/constants";
import {PRODUCTION_ENV} from "@ranjodhbirkaur/constants";
import {createNewSession} from "../util/tools";

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

    const clientUserExist = await MainUserModel.findOne({email: modelProps.email});
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

            if(userType === clientUserType) {
                const newUser = MainUserModel.build({
                    email: userExist[EMAIL],
                    jwtId,
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
                    req, userType, responseData: response, existingUser: {jwtId}
                });

                const payload: JwtPayloadType = {
                    [JWT_ID]: jwtId,
                    [ID]: userExist[ID],
                    [USER_NAME]: userExist[USER_NAME] || '',
                    [clientType]: userExist[clientType] || '',
                    [SESSION_ID]: newSession._id || '',
                };

                await OnCreateNewUser(userExist[ID]);

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
export async function OnCreateNewUser(userId: string) {

    const createdAt = DateTime.local().setZone('UTC').toJSDate();

    const newApplicationSpace = ApplicationSpaceModel.build({
        clientUserId: userId,
        name: EXAMPLE_APPLICATION_NAME,
        env: [PRODUCTION_ENV],
        hasQueryModel: false,
        updatedBy: userId,
        description: 'This is an example space',
        createdAt,
        createdBy: userId,
        updatedAt: createdAt
    });

    await newApplicationSpace.save();
}


