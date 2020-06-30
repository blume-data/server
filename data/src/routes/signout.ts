import express from 'express';
import {signOutUrl} from "../util/urls";
import {okayStatus} from "../util/constants";

const router = express.Router();

router.post(signOutUrl, (req, res) => {
  req.session = null;

  res.status(okayStatus).send({});
});

export { router as signoutRouter };
