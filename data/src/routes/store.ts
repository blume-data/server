import express from "express";
import {StoreUrl} from "../util/urls";
import {createStoreRecord, getStoreRecord} from "../Controllers/StoreController";
import {validateEnvType} from "../util/enviornmentTypes";
import {checkAuth} from "../services/checkAuth";
import {validateApplicationNameMiddleWare} from "../services/validateApplicationNameMiddleWare";

const router = express.Router();

// Get Data
router.get(
    StoreUrl,
    validateEnvType, checkAuth,
    validateApplicationNameMiddleWare,
    getStoreRecord
);
// Create Data
router.post(
    StoreUrl, validateEnvType, checkAuth,
    validateApplicationNameMiddleWare, createStoreRecord
);

export { router as StoreRoutes };