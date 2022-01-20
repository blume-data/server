import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  generateJwt,
  sendJwtResponse,
  
  stringLimitOptionErrorMessage,
  stringLimitOptions,
  JWT_ID,
  CLIENT_USER_NAME,
  APPLICATION_NAMES, PayloadResponseType, JwtPayloadType, PASSWORD, sendSingleError, SESSION_ID, ID
} from '../../../util/common-module';
import {clientUserType,
  freeUserType,
  superVisorUserType,
  supportUserType, USER_NAME, clientType} from '@ranjodhbirkaur/constants';
import { Password } from '../services/password';

import {InValidEmailMessage, InvalidLoginCredentialsMessage} from "../util/errorMessages";
import {ExistingUserType, passwordLimitOptionErrorMessage, passwordLimitOptions} from "../util/constants";

import {signInUrl} from "../util/urls";
import {validateUserType} from "../middleware/userTypeCheck";
import {UserModel as MainUserModel} from "../../../db-models/UserModel";

import {createNewSession} from "../util/tools";

const router = express.Router();

async function sendResponse(req: Request, res: Response, responseData: PayloadResponseType, existingUser: ExistingUserType, password: string, userType: string) {

  if (!existingUser) {
    
    throw new BadRequestError(InvalidLoginCredentialsMessage);
  }

  const passwordsMatch = await Password.compare(
      existingUser.password,
      password
  );
  if (!passwordsMatch) {
    throw new BadRequestError(InvalidLoginCredentialsMessage);
  }

  const newSession = createNewSession({
    req, existingUser, responseData, userType
  });

  const payload: JwtPayloadType = {
    [clientType]: userType,
    [USER_NAME]: existingUser.userName,
    [JWT_ID]: existingUser.jwtId,
    [ID]: existingUser._id,
    [SESSION_ID]: newSession._id || ''
  };

  // generate JWT and cookie
  const userJwt = generateJwt(payload, res);

  await newSession.save();

  return sendJwtResponse(res, responseData, userJwt);
}

router.post(
    signInUrl(), validateUserType,
  [
    body('userName')
      .optional()
      .isLength(stringLimitOptions)
      .withMessage(stringLimitOptionErrorMessage('userName')),
    body('email')
      .optional()
      .isEmail()
      .withMessage(InValidEmailMessage),
    body('password')
      .trim()
      .isLength(passwordLimitOptions)
      .withMessage(passwordLimitOptionErrorMessage('password')),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userType = req.params.userType;
    let existingUser: any;
    let responseData: PayloadResponseType;

    switch (userType) {
      case clientUserType: {
        existingUser = await MainUserModel.findOne({email}, [APPLICATION_NAMES, USER_NAME, PASSWORD, JWT_ID]);
        if(existingUser) {
          responseData = {
            [ID]: existingUser._id,
            [clientType]: userType,
            [CLIENT_USER_NAME]: existingUser[USER_NAME],
            [USER_NAME]: existingUser[USER_NAME]
        }
        await sendResponse(req, res, responseData, existingUser, password, userType);
        return;
        }
        break;
      }
      
      default: {
        if(userType === superVisorUserType || userType === supportUserType || userType === freeUserType) {
          if (existingUser) {
            responseData = {
              [clientType]: userType,
              [ID]: existingUser[ID],
              [CLIENT_USER_NAME]: existingUser[CLIENT_USER_NAME],
              [USER_NAME]: existingUser[USER_NAME]
            }
            return sendResponse(req, res, responseData, existingUser, password, userType);
          }
        }
        break;
      }

    }

    if(!existingUser) {
      return sendSingleError(res, InvalidLoginCredentialsMessage)
    }
  }
);

export { router as signinRouter };
