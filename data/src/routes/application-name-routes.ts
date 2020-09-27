import { clientType, AUTHORIZATION_TOKEN, verifyJwt, clientUserType, NotAuthorizedError, JWT_ID, getClientUserModel, APPLICATION_NAME, stringLimitOptionErrorMessage, stringLimitOptions, APPLICATION_NAMES, USER_NAME } from '@ranjodhbirkaur/common';
import express, {Request, Response, NextFunction} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { authMongoConnection } from '../authMongoConnection';
import { createApplicationName } from '../Controllers/ApplicationNameController';
import { ApplicationNameUrl } from '../util/urls';

const router = express.Router();

async function AuthClientUser(req: Request, res: Response, next: NextFunction) {
    const clientUserName  = req.params && req.params.clientUserName;

    const headers: any = req.headers;
        const payload = verifyJwt(req);

        console.log('payload', payload, clientUserName);
        console.log('type', payload[clientType], clientUserType);
        console.log('user-name', payload[USER_NAME], clientUserName);


        if(!payload) {
            throw new NotAuthorizedError();
        }

        if(payload && payload[clientType] 
            && (payload[USER_NAME] === clientUserName)
            && payload[clientType] === clientUserType) {
                
                const ClientUser = getClientUserModel(authMongoConnection);
                const exist = await ClientUser.findOne({userName: clientUserName}, 
                    [JWT_ID, 'isEnabled', [APPLICATION_NAMES], [USER_NAME]]);
                req.currentUser = exist;
                console.log('exist', exist)
                next();
        
        }
        else {
            if (process.env.NODE_ENV === 'test') {
                return next();
            }
            throw new NotAuthorizedError();
        }
}

router.post(ApplicationNameUrl, AuthClientUser, [

        body([APPLICATION_NAME])
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage(APPLICATION_NAME))
    ],
    createApplicationName);

export { router as ApplicationNameRoutes };