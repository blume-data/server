import express, {Response, Request, NextFunction} from 'express';
import {BadRequestError, currentUser, okayStatus} from '@ranjodhbirkaur/common';
import {currentUserUrl} from "../util/urls";
import {ClientUser} from "../models/clientUser";

const router = express.Router();

async function checkIsEnabled(req: Request, res: Response, next: NextFunction) {

  if (req.currentUser) {
    const email = req.currentUser.email;
    const userExist = await ClientUser.find({email, isEnabled: true}, 'id');
    if (!userExist) {
      req.currentUser = undefined;
      req.session = null;
    }
  }
  next();
}

router.get(currentUserUrl, currentUser, checkIsEnabled, (req: Request, res: Response) => {
  if (req.currentUser) {
    res.status(okayStatus).send({ currentUser: req.currentUser });
  }
  else {
    throw new BadRequestError('Account is not authenticated. Please try to login again!');
  }
});

export { router as currentUserRouter };
