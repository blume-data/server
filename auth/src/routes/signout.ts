import express, {NextFunction, Request, Response} from 'express';
import {JwtPayloadType, okayStatus, sendSingleError, SESSION_ID, verifyJwt} from "@ranjodhbirkaur/common";
import {signOutUrl} from "../util/urls";
import {validateUserType} from "../middleware/userTypeCheck";
import {SessionModel} from "../models/SessionModel";

const router = express.Router();

async function checkAuth(req: Request, res: Response, next: NextFunction) {

  /*Send Not Authorised Response*/
  function notAuthorized() {
    sendSingleError(res, 'Not authorised');
  }

  const payload: JwtPayloadType = verifyJwt(req);

  if(!payload) {
    return notAuthorized();
  }
  else {
    next();
  }
}

router.post(signOutUrl(), validateUserType, checkAuth, async (req: Request, res: Response) => {

  const payload: JwtPayloadType = verifyJwt(req);

  // set the active status as false of the session
  await SessionModel.updateOne({
    _id: payload[SESSION_ID]
  }, {
    isActive: false
  });

  return res.status(okayStatus).send(true);
});

export { router as signoutRouter };
