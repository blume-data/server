import express from "express";
import {GetEntriesUrl, StoreReferenceUrl, StoreUrl} from "../util/urls";
import {createStoreRecord, getStoreRecord} from "../Controllers/StoreController";
import {validateEnvType} from "../util/enviornmentTypes";
import {checkAuth} from "../services/checkAuth";
import {validateApplicationNameMiddleWare} from "../services/validateApplicationNameMiddleWare";

const router = express.Router();

// Get Data
router.all(
    GetEntriesUrl,
    validateEnvType, checkAuth,
    validateApplicationNameMiddleWare,
    getStoreRecord
);
// Create Data
router.post(
    StoreUrl, validateEnvType, checkAuth,
    validateApplicationNameMiddleWare, createStoreRecord
);

// Create Reference
router.post(StoreReferenceUrl, validateEnvType, checkAuth, validateApplicationNameMiddleWare)

export { router as StoreRoutes };