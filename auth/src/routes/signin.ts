import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  generateJwt,
  sendJwtResponse,
  clientUserType,
  adminUserType,
  freeUserType,
  superVisorUserType,
  supportUserType,
  stringLimitOptionErrorMessage,
  stringLimitOptions,
  JWT_ID,
  USER_NAME,
  CLIENT_USER_NAME,
  clientType,
  APPLICATION_NAME,
  APPLICATION_NAMES, PayloadResponseType, JwtPayloadType, PASSWORD, sendSingleError, EnglishLanguage, SESSION_ID
} from '@ranjodhbirkaur/common';
import { Password } from '../services/password';

import {InValidEmailMessage, InvalidLoginCredentialsMessage} from "../util/errorMessages";
import {ExistingUserType, passwordLimitOptionErrorMessage, passwordLimitOptions} from "../util/constants";

import {signInUrl} from "../util/urls";
import {validateUserType} from "../middleware/userTypeCheck";
import {MainUserModel} from "../models/MainUserModel";
import {SessionModel} from "../models/SessionModel";
import {PRODUCTION_ENV} from "@ranjodhbirkaur/constants";

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

  const payload: JwtPayloadType = {
    [clientType]: userType,
    [USER_NAME]: existingUser.userName,
    [JWT_ID]: existingUser.jwtId
  };

  const userJwt = generateJwt(payload, res);

  const newSession = SessionModel.build({
    clientType: userType,
    userName: responseData[USER_NAME],
    selectedEnv: PRODUCTION_ENV,
    clientUserName: responseData[CLIENT_USER_NAME],
    selectedApplicationName: '',
    authToken: userJwt,
    createdAt: new Date(),
  });

  await newSession.save();

  responseData = {
    ...responseData,
    [SESSION_ID]: newSession.id || ''
  }

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
    const { email, password, userName } = req.body;
    const userType = req.params.userType;
    let existingUser;
    let responseData: PayloadResponseType;

    switch (userType) {
      case clientUserType: {
        existingUser = await MainUserModel.findOne({email}, [APPLICATION_NAMES, USER_NAME, PASSWORD, JWT_ID]);
        if(existingUser) {
          responseData = {
            [SESSION_ID]: '',
            [clientType]: userType,
            [APPLICATION_NAMES]: JSON.parse(existingUser[APPLICATION_NAMES]),
            [CLIENT_USER_NAME]: existingUser[USER_NAME],
            [USER_NAME]: existingUser[USER_NAME]
        }
        return sendResponse(req, res, responseData, existingUser, password, userType);
        }
        break;
      }
      case adminUserType: {
        break;
      }
      
      default: {
        if(userType === superVisorUserType || userType === supportUserType || userType === freeUserType) {
          if (existingUser) {
            responseData = {
              [SESSION_ID]: '',
              [clientType]: userType,
              [APPLICATION_NAMES]: JSON.parse(existingUser[APPLICATION_NAME]),
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
