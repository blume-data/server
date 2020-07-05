import express from 'express';
import {stringLimitOptionErrorMessage, stringLimitOptions} from "../util/constants";
import {body} from "express-validator";
import {validateRequest} from "@ranjodhbirkaur/common";
import {CollectionUrl} from "../util/urls";
import {createItemSchema, deleteItemSchema} from "../Controllers/CollectionController";

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
    validateRequest, createItemSchema);

// Delete Item Schema
router.delete(CollectionUrl, [
        body('name')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('name'))
    ],
    validateRequest, deleteItemSchema);

export { router as CollectionRoutes };