import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {validateRequest, BadRequestError} from '@ranjodhbirkaur/common';

import { Password } from '../services/password';

import {signInUrl} from "../util/urls";
import {ClientUser} from "../models/clientUser";
import {InValidEmailMessage, InvalidLoginCredentialsMessage} from "../util/errorMessages";
import {passwordLimitOptionErrorMessage, passwordLimitOptions} from "../util/constants";
import {validateUserType} from "../middleware/userTypeCheck";
import {generateJwt, sendJwtResponse} from "../util/methods";

const router = express.Router();

router.post(
    signInUrl, validateUserType,
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

    const existingUser = await ClientUser.findOne({ email });
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
      userName: existingUser.userName
    };
    const userJwt = generateJwt(payload, req);

    return sendJwtResponse(res, payload, userJwt, existingUser);
  }
);

export { router as signinRouter };
