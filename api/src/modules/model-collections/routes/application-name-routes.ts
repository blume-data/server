import {
    APPLICATION_NAME,
    stringLimitOptionErrorMessage,
    stringLimitOptions,
    validateRequest, sendSingleError
} from '../../../util/common-module';
import express, {Request, Response, NextFunction} from 'express';
import { body } from 'express-validator';
import { createApplicationName, getApplicationName } from '../Controllers/ApplicationNameController';
import { ApplicationNameUrl } from '../../../util/urls';
import {checkAuth} from "../../../services/checkAuth";
import {clientType, clientUserType} from '@ranjodhbirkaur/constants';

const router = express.Router();

async function AuthClientUser(req: Request, res: Response, next: NextFunction) {

    if(req.currentUser[clientType] === clientUserType) {
        next();
    }
    else {
        return sendSingleError(res, `Only ${clientUserType} can create application space`);
    }
}

router.post(ApplicationNameUrl, checkAuth, AuthClientUser, [
        body('applicationName')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage(APPLICATION_NAME))
    ], validateRequest,
    createApplicationName);


router.get(ApplicationNameUrl, checkAuth, getApplicationName);

export { router as ApplicationNameRoutes };