import express from 'express';
import {stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {body} from "express-validator";
import {validateRequest, validateEnvType} from "@ranjodhbirkaur/common";
import {CollectionUrl} from "../util/urls";
import {createCollectionSchema, deleteCollectionSchema, getCollectionSchema} from "../Controllers/CollectionController";
import {validateCollections} from "../services/middlewares/collections/validateCollections";
import {checkAuth} from "../services/checkAuth";

const router = express.Router();

// Create Item Schema
router.post(CollectionUrl, [
        body('rules')
            .notEmpty()
            .withMessage('rules is required'),
        body('name')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('name'))
    ],
    validateRequest, validateEnvType, checkAuth, validateCollections, createCollectionSchema);

// Delete Item Schema
router.delete(CollectionUrl, [
        body('name')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('name'))
    ],
    validateRequest, validateEnvType, checkAuth, deleteCollectionSchema);

// Get Item Schema
router.get(CollectionUrl, checkAuth, getCollectionSchema);

export { router as CollectionRoutes };