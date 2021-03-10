import express, { NextFunction, Request, Response } from "express";
import { getSetting } from "../Controllers/SettingController";
import { checkAuth } from "../services/checkAuth";
import { validateApplicationNameMiddleWare } from "../services/validateApplicationNameMiddleWare";
import { validateEnvType } from "../util/enviornmentTypes";
import { SettingUrl } from "../util/urls";

const router = express.Router();

router.get(
    SettingUrl,
    validateEnvType,
    checkAuth,
    validateApplicationNameMiddleWare,
    getSetting
);