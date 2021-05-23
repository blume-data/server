import express from "express";
import { getSetting } from "../Controllers/SettingController";
import { checkAuth } from "../../../services/checkAuth";
import { validateApplicationNameMiddleWare } from "../../../services/validateApplicationNameMiddleWare";
import { SettingUrl } from "../../../util/urls";

const router = express.Router();

router.get(
    SettingUrl,
    checkAuth,
    validateApplicationNameMiddleWare,
    getSetting
);

export { router as SettingRoutes };