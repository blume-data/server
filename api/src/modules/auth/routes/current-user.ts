import express, {Response, Request, NextFunction} from 'express';
import {BadRequestError, getCurrentUser, okayStatus} from '../../../util/common-module';

import {currentUserUrl} from "../util/urls";
import {UserModel as MainUserModel} from "../../../db-models/UserModel";

const router = express.Router();

async function checkIsEnabled(req: Request, res: Response, next: NextFunction) {

  if (req.currentUser) {
    const email = req.currentUser.email;
    const userExist = await MainUserModel.find({email, isEnabled: true}, 'id');
    if (!userExist) {
      req.currentUser = undefined;
    }
  }
  next();
}

router.get(currentUserUrl(), getCurrentUser, checkIsEnabled, (req: Request, res: Response) => {
  if (req.currentUser) {
    res.status(okayStatus).send({ currentUser: req.currentUser });
  }
  else {
    throw new BadRequestError('Account is not authenticated. Please try to login again!');
  }
});

export { router as currentUserRouter };