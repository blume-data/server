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
import {USER_NAME, clientType} from '@ranjodhbirkaur/constants';
import { Password } from '../services/password';
import {InValidEmailMessage, InvalidLoginCredentialsMessage} from "../util/errorMessages";
import {ExistingUserType, passwordLimitOptionErrorMessage, passwordLimitOptions} from "../util/constants";
import {signInUrl} from "../util/urls";
import {UserModel as MainUserModel} from "../../../db-models/UserModel";
import {createNewSession} from "../util/tools";

const router = express.Router();

async function sendResponse(req: Request, res: Response, responseData: PayloadResponseType, existingUser: ExistingUserType, password: string) {

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
    req, existingUser, responseData
  });

  const payload: JwtPayloadType = {
    clientUserName: existingUser.clientUserName,
    [clientType]: existingUser.type,
    [USER_NAME]: existingUser.userName,
    [JWT_ID]: existingUser.jwtId,
    [ID]: existingUser._id,
    [SESSION_ID]: newSession._id || '',
    userGroupIds: existingUser.userGroupIds
  };

  // generate JWT and cookie
  const userJwt = generateJwt(payload, res);

  await newSession.save();

  return sendJwtResponse(res, responseData, userJwt);
}

router.post(
    signInUrl,
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

    const find: any = {};
    
    if(email) find.email = email;
    if(userName) find.userName = userName;

    const existingUser: any = await MainUserModel.findOne(find, [APPLICATION_NAMES, USER_NAME, PASSWORD, JWT_ID, 'userGroupIds', CLIENT_USER_NAME, 'type']);

    if(!existingUser) {
      return sendSingleError(res, InvalidLoginCredentialsMessage)
    }
    else {

      const responseData: PayloadResponseType = {
        [ID]: existingUser._id,
        [clientType]: existingUser.type,
        [CLIENT_USER_NAME]: existingUser[USER_NAME],
        [USER_NAME]: existingUser[USER_NAME]
      }
      
      await sendResponse(req, res, responseData, existingUser, password);
    }
  }
);

export { router as signinRouter };
