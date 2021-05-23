import express, { NextFunction, Request, Response } from "express";
import {GetEntriesUrl, StoreReferenceUrl, StoreUrl} from "../../../util/urls";
import {createStoreRecord, deleteStoreRecord, getStoreRecord} from "../Controllers/StoreController";
import {checkAuth} from "../../../services/checkAuth";
import {validateApplicationNameMiddleWare} from "../../../services/validateApplicationNameMiddleWare";
import { sendSingleError } from "../../../util/common-module";

const router = express.Router();

// Get Data
router.all(
    GetEntriesUrl, checkAuth,
    validateApplicationNameMiddleWare,
    getStoreRecord
);
// Create Data
router.post(
    StoreUrl, checkAuth,
    validateApplicationNameMiddleWare, createStoreRecord
);

// Update Data
router.put(
    StoreUrl, checkAuth,
    validateApplicationNameMiddleWare,
    (req: Request, res: Response, next: NextFunction) => {
        const {_id} = req.body;
        if(!_id) {
            sendSingleError(res, '_id is required');
        }
        else {
            next();
        }
    },
    createStoreRecord
);

// Create Reference
router.post(StoreReferenceUrl, checkAuth, validateApplicationNameMiddleWare);

// Delete Entry
router.delete(StoreUrl, checkAuth, validateApplicationNameMiddleWare, deleteStoreRecord);

export { router as StoreRoutes };