import express from "express";
import {StoreUrl} from "../util/urls";
import {createStoreRecord, getStoreRecord} from "../Controllers/StoreController";

const router = express.Router();

// Get Data
router.get(StoreUrl, getStoreRecord);
// Create Data
router.post(StoreUrl, createStoreRecord);

export { router as StoreRoutes };