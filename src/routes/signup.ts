import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@ranjodhbirkaur/common';

import {rootUrl, stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {TempUser} from "../models/tempUser";
import {RANDOM_STRING} from "../util/methods";

const router = express.Router();

router.post(
  rootUrl+'client/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
      body('firstName')
          .isLength(stringLimitOptions)
          .withMessage(stringLimitOptionErrorMessage('First name')),
    body('lastName')
        .isLength(stringLimitOptions)
        .withMessage(stringLimitOptionErrorMessage('Last name')),
    body('userName')
        .isLength(stringLimitOptions)
        .withMessage(stringLimitOptionErrorMessage('User name')),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, userName } = req.body;

    let existingUser = await TempUser.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    existingUser = await TempUser.findOne({ userName });
    if (existingUser) {
      throw new BadRequestError('Username in use');
    }

    const verificationToken = RANDOM_STRING(4);

    const user = TempUser.build({ email, password, firstName, isVerified: false, lastName, role: 'client', userName, verificationToken });
    await user.save();

    const payload = {
        id: user.id,
        email: user.email,
        userName: user.userName,
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

    res.status(201).send({... payload, accessToken: userJwt});
  }
);

export { router as signupRouter };
