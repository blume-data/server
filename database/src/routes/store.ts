import express, {Response, Request, NextFunction} from "express";
import {RanjodhbirModel} from "../ranjodhbirDb/model";
import {errorStatus, FIELD, MESSAGE, okayStatus} from "@ranjodhbirkaur/common";
import {rootUrl} from "../utils/constants";
import {addDataUrl, getDataUrl, schemaUrl} from "../utils/urls";

const route = express.Router();

function validateStoreRequest(req: Request, res: Response, next: NextFunction) {
    const {modelName='', clientUserName=''} = req.body;
    if (!modelName) {
        return res.status(errorStatus).send({
            errors: [{
                [FIELD]: 'modelName',
                [MESSAGE]: 'modelName is required'
            }]
        });
    }
    else if(!clientUserName) {
        return res.status(errorStatus).send({
            errors: [{
                [FIELD]: 'clientUserName',
                [MESSAGE]: 'clientUserName is required'
            }]
        });
    }
    else {
        next();
    }

}

route.post(`${rootUrl}/${schemaUrl}`,

    validateStoreRequest,

    async (req: Request, res: Response) => {

    const {modelName='', clientUserName='', connectionName} = req.body;
    const db = new RanjodhbirModel(modelName, clientUserName, connectionName);
    await db.createSchema();
    res.status(okayStatus).send(true);

});

route.post(`${rootUrl}/${getDataUrl}`,
    validateStoreRequest,

    async (req: Request, res: Response) => {

    const {modelName='', clientUserName='', connectionName, conditions={}} = req.body;
    const {pageNo=1, perPage=10, where={}, getOnly={}} = conditions;
    const db = new RanjodhbirModel(modelName, clientUserName, connectionName);
    const data = await db.readData({pageNo, perPage, where ,getOnly});
    res.status(okayStatus).send(data);

});

route.post(`${rootUrl}/${addDataUrl}`,

    validateStoreRequest,

    async (req: Request, res: Response) => {

    const {modelName='', data={}, clientUserName='', connectionName} = req.body;
    const db = new RanjodhbirModel(modelName, clientUserName, connectionName);
    await db.mutateData({
        action: "post",
        item: data
    });
    res.status(okayStatus).send(data);

});

export { route as StoreRoutes };