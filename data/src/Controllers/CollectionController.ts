import {Request, Response} from 'express';
import {BadRequestError} from "@ranjodhbirkaur/common";
import {errorStatus, SUPPORTED_DATA_TYPES} from "../util/constants";
import {RANDOM_STRING} from "../util/methods";
import {CollectionModel} from "../models/Collection";
import {
    COLLECTION_ALREADY_EXIST,
    INVALID_RULES_MESSAGE,
    REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN
} from "./Messages";
import {createMethod} from "../services/crudMethods";

export async function createItemSchema(req: Request, res: Response) {

    const userName  = req.params && req.params.userName;

    const reqBody = req.body;

    let isValidBody = true;

    // the name of the custom schema collection should not contain any space
    if (reqBody && reqBody.name && typeof reqBody.name === 'string') {
        reqBody.name = reqBody.name.split(' ').join('_');
    }

    const randomCollectionName = `_${userName}_${reqBody.name}`;

    // Check if there is not other collection with same name and user_id
    const alreadyExist = await CollectionModel.findOne({
        userName: userName, name: reqBody.name
    }, 'id');
    if (alreadyExist) {
        throw new BadRequestError(COLLECTION_ALREADY_EXIST);
    }

    let inValidMessage = [];

    // Validate Rules
    if (reqBody.rules && typeof reqBody.rules === 'object' && reqBody.rules.length) {
        reqBody.rules.forEach((rule: {type: string, required?: boolean, name: string}) => {
            // Validate rule type
            if (typeof rule.type === 'string' && SUPPORTED_DATA_TYPES.includes(rule.type)) {
                // remove all the spaces
                rule.name = rule.name.split(' ').join('_');
            }
            if (rule.required !== true && typeof rule.required !== 'boolean') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`
                });
            }
            else {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name} should have valid type`
                });
            }
        });
    }
    else {
        isValidBody = false;
        inValidMessage.push({
            message: INVALID_RULES_MESSAGE,
            field: 'rules'
        })
    }

    if (!isValidBody) {
        return res.status(errorStatus).send({
            errors: inValidMessage
        });
    }

    const data = {
        userName: userName,
        rules: JSON.stringify(reqBody.rules),
        name: reqBody.name,
        stored_in: randomCollectionName
    };

    console.log('data', data);
    //createMethod(res, data, CollectionModel);
}


