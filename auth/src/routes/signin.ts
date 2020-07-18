import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {validateRequest, BadRequestError, validateEnvType} from '@ranjodhbirkaur/common';

import { Password } from '../services/password';

import {signIn} from "../util/urls";
import {AUTH_TOKEN, USER_NAME, okayStatus} from "../util/constants";
import {ClientUser} from "../models/clientUser";

const router = express.Router();

router.post(
    signIn,
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest, validateEnvType,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await ClientUser.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials: Email/Password not valid');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials: Email/Password not valid');
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
