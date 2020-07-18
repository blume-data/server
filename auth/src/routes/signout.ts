import express from 'express';
import {signOutUrl} from "../util/urls";
import {okayStatus} from "../util/constants";
import {validateEnvType} from "@ranjodhbirkaur/common";

const router = express.Router();

router.post(signOutUrl, validateEnvType, (req, res) => {
  req.session = null;

  res.status(okayStatus).send({});
});

export { router as signoutRouter };
