import express from "express";
import {RoleUrl} from "../util/urls";
import {SignUp} from "../Controllers/AuthController";
import {requireAuth} from "@ranjodhbirkaur/common";

const router = express.Router();

router.post(RoleUrl, requireAuth, SignUp);

export { router as AuthRoutes };
