import express from "express";
import {SignUpUrl} from "../util/urls";
import {SignUp} from "../Controllers/AuthController";

const router = express.Router();

router.post(SignUpUrl, SignUp);
