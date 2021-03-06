import express, { NextFunction, Request, Response } from "express";
import {GetEntriesUrl, StoreReferenceUrl, StoreUrl} from "../util/urls";
import {createStoreRecord, deleteStoreRecord, getStoreRecord} from "../Controllers/StoreController";
import {validateEnvType} from "../util/enviornmentTypes";
import {checkAuth} from "../services/checkAuth";
import {validateApplicationNameMiddleWare} from "../services/validateApplicationNameMiddleWare";
import { sendSingleError } from "@ranjodhbirkaur/common";

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

// Update Data
router.put(
    StoreUrl, validateEnvType, checkAuth,
    validateApplicationNameMiddleWare,
    (req: Request, res: Response, next: NextFunction) => {
        const {_id} = req.body;
        if(!_id) {
            sendSingleError(res, 'id is required');
        }
        else {
            next();
        }
    },
    createStoreRecord
);

// Create Reference
router.post(StoreReferenceUrl, validateEnvType, checkAuth, validateApplicationNameMiddleWare);

// Delete Entry
router.delete(StoreUrl, validateEnvType, checkAuth, validateApplicationNameMiddleWare, deleteStoreRecord);

export { router as StoreRoutes };