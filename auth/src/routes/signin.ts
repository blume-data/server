import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {validateRequest, BadRequestError,
  generateJwt, sendJwtResponse,
  clientUserType, adminUserType, freeUserType, superVisorUserType, supportUserType, stringLimitOptionErrorMessage, stringLimitOptions, ClientUserJwtPayloadType, JWT_ID, USER_NAME, CLIENT_USER_NAME, clientType, APPLICATION_NAME} from '@ranjodhbirkaur/common';
import { Password } from '../services/password';
import {ClientUser} from "../models/clientUser";
import {InValidEmailMessage, InvalidLoginCredentialsMessage} from "../util/errorMessages";
import {passwordLimitOptionErrorMessage, passwordLimitOptions} from "../util/constants";
import {validateUserType} from "../middleware/userTypeCheck";
import {AdminUser} from "../models/adminUser";
import {signInUrl} from "../util/urls";
import { FreeUser } from '../models/freeUser';

const router = express.Router();

router.post(
    signInUrl(),
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

    switch (userType) {
      case clientUserType: {
        existingUser = await ClientUser.findOne({email});
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
            payload = {
              ...payload,
              [CLIENT_USER_NAME]: existingUser[CLIENT_USER_NAME],
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
    
    const userJwt = generateJwt(payload, req);

    return sendJwtResponse(res, payload, userJwt, existingUser);
  }
);

export { router as signinRouter };
