import express from 'express';
import {body} from "express-validator";
import {validateRequest, stringLimitOptionErrorMessage, stringLimitOptions} from "@ranjodhbirkaur/common";
import {CollectionUrl, GetCollectionNamesUrl} from "../util/urls";
import {
    createCollectionSchema,
    deleteCollectionSchema,
    getCollectionNames,
    getCollectionSchema
} from "../Controllers/CollectionController";
import {validateCollections} from "../services/middlewares/collections/validateCollections";
import {checkAuth} from "../services/checkAuth";
import {validateEnvType} from "../util/enviornmentTypes";
import {validateApplicationNameMiddleWare} from "../services/validateApplicationNameMiddleWare";

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
    validateRequest, validateEnvType, checkAuth,
    validateApplicationNameMiddleWare, validateCollections, createCollectionSchema
);

router.get(GetCollectionNamesUrl, validateEnvType, checkAuth, validateApplicationNameMiddleWare, getCollectionNames);

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