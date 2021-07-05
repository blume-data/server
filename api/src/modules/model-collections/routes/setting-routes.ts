import express from "express";
import { getSetting, makeSetting } from "../Controllers/SettingController";
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

router.post(SettingUrl, checkAuth, validateApplicationNameMiddleWare, makeSetting);
router.put(SettingUrl, checkAuth, validateApplicationNameMiddleWare, makeSetting);

export { router as SettingRoutes };