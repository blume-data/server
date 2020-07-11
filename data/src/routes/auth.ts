import express from "express";
import {RoleUrl} from "../util/urls";
import {SignUp} from "../Controllers/AuthController";
import {checkAuth} from "../services/checkAuth";

const router = express.Router();

router.post(RoleUrl, checkAuth, SignUp);

export { router as AuthRoutes };
