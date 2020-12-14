import express, {Request, Response} from 'express';
import {okayStatus} from "@ranjodhbirkaur/common";
import {signOutUrl} from "../util/urls";
import {validateUserType} from "../middleware/userTypeCheck";

const router = express.Router();

router.post(signOutUrl(), validateUserType, (req: Request, res: Response) => {
  res.status(okayStatus).send(true);
});

export { router as signoutRouter };
