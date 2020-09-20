import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {validateRequest, BadRequestError,
  generateJwt, sendJwtResponse,
  clientUserType, adminUserType} from '@ranjodhbirkaur/common';
import { Password } from '../services/password';
import {ClientUser} from "../models/clientUser";
import {InValidEmailMessage, InvalidLoginCredentialsMessage} from "../util/errorMessages";
import {passwordLimitOptionErrorMessage, passwordLimitOptions} from "../util/constants";
import {validateUserType} from "../middleware/userTypeCheck";
import {AdminUser} from "../models/adminUser";
import {signInUrl} from "../util/urls";

const router = express.Router();

router.post(
    signInUrl(), validateUserType,
  [
    body('email')
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
    let existingUser;

    switch (userType) {
      case clientUserType: {
        existingUser = await ClientUser.findOne({email});
        break;
      }
      case adminUserType: {
        existingUser = await AdminUser.findOne({email});
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

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      userName: existingUser.userName,
      jwtId: existingUser.jwtId
    };
    const userJwt = generateJwt(payload, req);

    return sendJwtResponse(res, payload, userJwt, existingUser);
  }
);

export { router as signinRouter };
