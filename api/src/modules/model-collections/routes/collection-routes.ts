import express from 'express';
import {body} from "express-validator";
import {validateRequest, stringLimitOptionErrorMessage, stringLimitOptions} from "../../../util/common-module";
import {CollectionUrl, GetCollectionNamesUrl} from "../../../util/urls";
import {
    createCollectionSchema,
    deleteCollectionSchema,
    getCollectionNames,
} from "../Controllers/CollectionController";
import {validateCollections} from "../../../services/middlewares/collections/validateCollections";
import {checkAuth} from "../../../services/checkAuth";
import {validateApplicationNameMiddleWare} from "../../../services/validateApplicationNameMiddleWare";

const router = express.Router();

// Create Item Schema
router.post(CollectionUrl, [
        body('rules')
            .notEmpty()
            .withMessage('rules is required'),
        body('name')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('name')),
        body('displayName')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('displayName')),
        body('description')
            .optional()
            .isLength({ max: 100 })
            .withMessage('description must be between 1 and 100 characters')
    ],
    validateRequest, checkAuth,
    validateApplicationNameMiddleWare, validateCollections, createCollectionSchema
);

router.put(CollectionUrl, [
        body('id')
            .notEmpty()
            .withMessage('id is required')
    ],
    validateRequest, checkAuth,
    validateApplicationNameMiddleWare, validateCollections, createCollectionSchema
);

/*get all the models of the application space*/
router.get(GetCollectionNamesUrl, checkAuth, validateApplicationNameMiddleWare, getCollectionNames);


// Delete Item Schema
router.delete(CollectionUrl, [
        body('name')
            .trim()
            .isLength(stringLimitOptions)
            .withMessage(stringLimitOptionErrorMessage('name'))
    ],
    validateRequest, checkAuth, deleteCollectionSchema);

export { router as CollectionRoutes };