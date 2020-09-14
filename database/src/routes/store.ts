import express, {Response, Request} from "express";
import {RanjodhbirModel} from "../ranjodhbirDb/model";
import {okayStatus, validateRequest} from "@ranjodhbirkaur/common";
import {rootUrl} from "../utils/constants";
import {addDataUrl, getDataUrl, schemaUrl} from "../utils/urls";
import {body} from "express-validator";

const route = express.Router();

route.post(`${rootUrl}/${schemaUrl}`,
    [
        body('modelName')
            .trim()
            .withMessage('modelName is required'),
        body('clientUserName')
            .trim()
            .withMessage('clientUserName is required'),
    ],
    validateRequest,

    async (req: Request, res: Response) => {

    const {modelName='', clientUserName='', schema} = req.body;
    const db = new RanjodhbirModel(modelName, clientUserName, schema);
    await db.createSchema();
    res.status(okayStatus).send(true);

});

route.post(`${rootUrl}/${getDataUrl}`,
    [
        body('modelName')
            .trim()
            .withMessage('modelName is required'),
        body('clientUserName')
            .trim()
            .withMessage('clientUserName is required')
    ],
    validateRequest,

    async (req: Request, res: Response) => {

    const {modelName='', where={}, getOnly={}, clientUserName='', skip=0, perPage=10} = req.body;
    const db = new RanjodhbirModel(modelName, clientUserName);
    const data = await db.readData({skip, perPage, where , getOnly });
    res.status(okayStatus).send({data});

});

route.post(`${rootUrl}/${addDataUrl}`,

    [
        body('modelName')
            .trim()
            .withMessage('modelName is required'),
        body('clientUserName')
            .trim()
            .withMessage('clientUserName is required')
    ],
    validateRequest,

    async (req: Request, res: Response) => {

    const {modelName='', data={}, clientUserName=''} = req.body;
    const db = new RanjodhbirModel(modelName, clientUserName);
    await db.storeData(data);
    res.status(okayStatus).send({data});

});

export { route as StoreRoutes };