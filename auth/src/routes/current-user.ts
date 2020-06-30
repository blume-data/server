import express, {Response, Request, NextFunction} from 'express';
import { currentUser } from '@ranjodhbirkaur/common';
import {currentUserUrl} from "../util/urls";
import {okayStatus} from "../util/constants";
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

router.get(currentUserUrl, currentUser, checkIsEnabled, (req, res) => {
  res.status(okayStatus).send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
