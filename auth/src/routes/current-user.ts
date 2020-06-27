import express from 'express';
import { currentUser } from '@ranjodhbirkaur/common';
import {currentUserUrl} from "../util/urls";
import {okayStatus} from "../util/constants";

const router = express.Router();

router.get(currentUserUrl, currentUser, (req, res) => {
  res.status(okayStatus).send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
