import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  generateJwt,
  sendJwtResponse,
  ClientUser,
  AdminUser,
  FreeUser,
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
  APPLICATION_NAMES, PayloadResponseType, JwtPayloadType, PASSWORD, sendSingleError
} from '@ranjodhbirkaur/common';
import { Password } from '../services/password';

import {InValidEmailMessage, InvalidLoginCredentialsMessage} from "../util/errorMessages";
import {ExistingUserType, passwordLimitOptionErrorMessage, passwordLimitOptions} from "../util/constants";

import {signInUrl} from "../util/urls";
import {validateUserType} from "../middleware/userTypeCheck";

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

  const userJwt = generateJwt(payload, req);

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
        existingUser = await ClientUser.findOne({email}, [APPLICATION_NAMES, USER_NAME, PASSWORD, JWT_ID]);
        if(existingUser) {
          responseData = {
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
        existingUser = await AdminUser.findOne({email});
        break;
      }
      
      default: {
        if(userType === superVisorUserType || userType === supportUserType || userType === freeUserType) {
          if (userName) {
            existingUser = await FreeUser.findOne({userName, clientType: userType}, [APPLICATION_NAME, CLIENT_USER_NAME, USER_NAME, PASSWORD]);
          }
          else {
            existingUser = await FreeUser.findOne({email, clientType: userType}, [APPLICATION_NAME, CLIENT_USER_NAME, USER_NAME, PASSWORD]);
          }
          if (existingUser) {
            responseData = {
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
