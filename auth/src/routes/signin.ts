import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {validateRequest, BadRequestError, okayStatus, AUTH_TOKEN, USER_NAME} from '@ranjodhbirkaur/common';

import { Password } from '../services/password';

import {signInUrl} from "../util/urls";
import {ClientUser} from "../models/clientUser";
import {InValidEmailMessage, InvalidLoginCredentialsMessage} from "../util/errorMessages";
import {passwordLimitOptionErrorMessage, passwordLimitOptions} from "../util/constants";
import {validateUserType} from "../middleware/userTypeCheck";

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
    // Generate JWT
    const userJwt = jwt.sign(
      payload,
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(okayStatus).send({...payload, [AUTH_TOKEN]: userJwt, [USER_NAME]: existingUser.userName});
  }
);

export { router as signinRouter };
