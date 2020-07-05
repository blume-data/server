import express from "express";
import {StoreUrl} from "../util/urls";
import {createStoreRecord} from "../Controllers/StoreController";

const router = express.Router();

// Get data
router.post(StoreUrl, createStoreRecord);

export { router as StoreRoutes };