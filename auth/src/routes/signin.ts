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
  APPLICATION_NAMES
} from '@ranjodhbirkaur/common';
import { Password } from '../services/password';

import {InValidEmailMessage, InvalidLoginCredentialsMessage} from "../util/errorMessages";
import {passwordLimitOptionErrorMessage, passwordLimitOptions} from "../util/constants";

import {signInUrl} from "../util/urls";
import {validateUserType} from "../middleware/userTypeCheck";

const router = express.Router();

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
    let payload = {};
    let responseData = {};

    switch (userType) {
      case clientUserType: {
        existingUser = await ClientUser.findOne({email});
        if(existingUser) {
          responseData = {
            ...responseData,
            [APPLICATION_NAMES]: JSON.parse(existingUser[APPLICATION_NAMES])
        }
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
            existingUser = await FreeUser.findOne({userName, clientType: userType});
          }
          else {
            existingUser = await FreeUser.findOne({email, clientType: userType});
          }
          if (existingUser) {
            responseData = {
              ...responseData,
              [APPLICATION_NAME]: existingUser[APPLICATION_NAME]
            }
          }
        }
        break;
      }

    }

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

    payload = {
      ...payload,
      [clientType]: userType,
      [USER_NAME]: existingUser.userName,
      [JWT_ID]: existingUser.jwtId
    };

    responseData = {
      ...responseData,
      [CLIENT_USER_NAME]: existingUser[USER_NAME],
      [clientType]: userType
    };
    
    const userJwt = generateJwt(payload, req);

    return sendJwtResponse(res, responseData, userJwt, existingUser);
  }
);

export { router as signinRouter };
