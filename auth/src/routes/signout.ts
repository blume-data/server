import express, {Request, Response} from 'express';
import {okayStatus} from "@ranjodhbirkaur/common";
import {signOutUrl} from "../util/urls";

const router = express.Router();

router.post(signOutUrl, (req: Request, res: Response) => {
  req.session = null;

  res.status(okayStatus).send(true);
});

export { router as signoutRouter };
