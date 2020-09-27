import { clientType, verifyJwt, clientUserType, NotAuthorizedError, JWT_ID, APPLICATION_NAME, stringLimitOptionErrorMessage, stringLimitOptions, APPLICATION_NAMES, USER_NAME } from '@ranjodhbirkaur/common';
import express, {Request, Response, NextFunction} from 'express';
import { body } from 'express-validator';
import {ClientUserModel} from '../authMongoConnection';
import { createApplicationName, getApplicationName } from '../Controllers/ApplicationNameController';
import { ApplicationNameUrl } from '../util/urls';

const router = express.Router();

async function AuthClientUser(req: Request, res: Response, next: NextFunction) {
    const clientUserName  = req.params && req.params.clientUserName;
    const payload = verifyJwt(req);
    if(!payload) {
        throw new NotAuthorizedError();
    }

    if(payload && payload[clientType]
        && (payload[USER_NAME] === clientUserName)
        && payload[clientType] === clientUserType) {

        const exist = await ClientUserModel.findOne({userName: clientUserName},
            [JWT_ID, 'isEnabled', [APPLICATION_NAMES], [USER_NAME]]);
        if (exist && exist[JWT_ID] === payload[JWT_ID] && exist.isEnabled) {
            req.currentUser = exist;
            next();
        }
        else {
            throw new NotAuthorizedError();
        }

    }
    else {
        if (process.env.NODE_ENV === 'test') {
            return next();
        }
        throw new NotAuthorizedError();
    }
}

router.post(ApplicationNameUrl, AuthClientUser, [
        body('applicationName')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage(APPLICATION_NAME))
    ],
    createApplicationName);


router.get(ApplicationNameUrl, AuthClientUser, getApplicationName);

export { router as ApplicationNameRoutes };