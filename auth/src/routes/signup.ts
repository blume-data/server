import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest, BadRequestError } from '@ranjodhbirkaur/common';

import {okayStatus, stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {TempUser} from "../models/tempUser";
import {RANDOM_STRING} from "../util/methods";
import {signUp} from "../util/urls";
import {ClientUser} from "../models/clientUser";

const router = express.Router();

router.post(
    signUp,
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

    let existingUser = await ClientUser.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Account with this Email already exist');
    }
    existingUser = await ClientUser.findOne({ userName });
    if (existingUser) {
      throw new BadRequestError('Username in use');
    }

    const verificationToken = RANDOM_STRING(4);

    const user = TempUser.build({ email, password, firstName, lastName, role: 'client', userName, verificationToken });
    await user.save();

    const payload = {
        id: user.id,
        email: user.email,
        userName: user.userName,
        verificationToken: user.verificationToken
    };

    res.status(okayStatus).send({... payload});
  }
);

export { router as signupRouter };
