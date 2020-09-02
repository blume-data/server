import express, {Request, Response} from 'express';
import {okayStatus, signOutUrl} from "@ranjodhbirkaur/common";

const router = express.Router();

router.post(signOutUrl, (req: Request, res: Response) => {
  req.session = null;

  res.status(okayStatus).send(true);
});

export { router as signoutRouter };
