import {Request, Response} from 'express';
import {CollectionModel} from "../models/Collection";
import {BadRequestError} from "@ranjodhbirkaur/common";
import {createModel} from "../util/methods";
import {errorStatus, okayStatus} from "../util/constants";
export async function createStoreRecord(req: Request, res: Response) {
    const userName  = req.params && req.params.userName;
    const collectionName = req.params && req.params.collectionName;



    // get collection
    const collection = await CollectionModel.findOne({userName, name: collectionName});
    if (collection) {
        const rules = JSON.parse(collection.rules);
        const reqBody = req.body;
        let body = {};
        let isValid = true;
        let inValidMessage = [];
        
        rules.forEach((rule: {type: string; name: string}) => {
            if (!reqBody[rule.name] || typeof reqBody[rule.name] !== rule.type) {
                isValid = false;
                inValidMessage.push(`${rule.name} is required`);
            }
            else {
                body = {
                    ...body,
                    [rule.name] : reqBody[rule.name]
                };
            }
        });

        if (!isValid) {
            console.log('inValidMessage');
            return res.status(errorStatus).send({
                errors: 'error in body data'
            });
        }

        const model = createModel({
            rules,
            connectionName: collection.connectionName,
            dbName: collection.dbName,
            name: collection.name
        });

        const item = new model(body);
        await item.save();

        res.status(okayStatus).send(item);

    }
    else {
        throw new BadRequestError('Collection not found');
    }
}

