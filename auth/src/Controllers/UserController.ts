import {Request, Response} from 'express';
import {
    BadRequestError,
    AUTH_TOKEN,
    okayStatus,
    USER_NAME,
    clientUserType,
    JwtPayloadType,
    JWT_ID,
    adminUserType,
    RANDOM_STRING,
    ROLE,
    PERMISSIONS,
    CLIENT_USER_NAME,
    APPLICATION_NAME,
    generateJwt,
    sendJwtResponse
} from "@ranjodhbirkaur/common";
import {ClientTempUser} from "../models/clientTempUser";
import {ClientUser} from "../models/clientUser";
import {TOKEN_NOT_VALID, USER_NAME_NOT_AVAILABLE} from "../util/errorMessages";
import {AdminUser} from "../models/adminUser";

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

            const newUser = await ClientUser.build({
                email: userExist.email,
                jwtId,
                created_at,
                password: userExist.password,
                firstName: userExist.firstName,
                lastName: userExist.lastName,
                userName: userExist.userName,
            });

            await newUser.save();

            const payload: JwtPayloadType = {
                [JWT_ID]: jwtId,
                [USER_NAME]: newUser.userName
            };

            // Generate JWT
            const userJwt = generateJwt(payload, req);

            // TODO
            // Send a request data srv to create a relationship between user and jwt

            sendJwtResponse(res, payload, userJwt, newUser);

            ClientTempUser.deleteMany({email: modelProps.email}).then(() => {});

            return res.status(okayStatus).send({... payload, [AUTH_TOKEN]: userJwt, [USER_NAME]: newUser.userName});

        }
        else {
            throw new BadRequestError(TOKEN_NOT_VALID);
        }
    }
};


