import {Request, Response} from 'express';
import {BadRequestError} from "@ranjodhbirkaur/common";
import {errorStatus, SUPPORTED_DATA_TYPES} from "../util/constants";
import {RANDOM_COLLECTION_NAME} from "../util/methods";
import {ItemsModel} from "../models/ItemSchema";
import {
    COLLECTION_ALREADY_EXIST,
    INVALID_BODY_MESSAGE,
    REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    RULE_DOES_NOT_EXIST_IN_RULE
} from "./Messages";
import {createMethod} from "../services/crudMethods";

export async function createItemSchema(req: Request, res: Response) {

    const reqBody = req.body;

    const userName  = req.params && req.params.userName;

    let isValidBody = true;

    const randomCollectionName = '_'+RANDOM_COLLECTION_NAME();

    const rules = {
        name : {
            required : true,
            type : "string"
        },
        body : {
            required : true,
        },
        rules: {
            required: true
        }
    };

    // the name of the custom schema collection should not contain any space
    if (reqBody && reqBody.name && typeof reqBody.name === 'string') {
        reqBody.name = reqBody.name.split(' ').join('_');
    }

    // Check if there is not other collection with same name and user_id
    const alreadyExist = await ItemsModel.findOne({ userName: userName, name: reqBody.name }, 'id');
    if (alreadyExist) {
        throw new BadRequestError(COLLECTION_ALREADY_EXIST);
    }

    interface BodyType {
        name: string;
        type: string;
    }

    // Validate the body object
    try {
        reqBody.body && reqBody.body.length && reqBody.body.forEach((data: BodyType) => {
            if (data.name
                && data.type
                && SUPPORTED_DATA_TYPES.includes(data.type)
                && typeof data.type === 'string'
                && typeof data.name === 'string') {
                // property is valid
                data.name = data.name.split(' ').join('_');
            }
            else {
                isValidBody = false;
            }
        });
    }
    catch (e) {
        isValidBody = false;
    }

    if (!isValidBody) {
        throw new BadRequestError(INVALID_BODY_MESSAGE);
    }

    let inValidMessage = [];

    // Check if rule contain space
    for(const ruleName in reqBody.rules) {
        if (reqBody.rules.hasOwnProperty(ruleName)) {
            if (ruleName.split(' ').length !== 1) {
                isValidBody = false;
                inValidMessage.push(`${ruleName} should not contain space`);
            }
        }
    }
    if (!isValidBody) {
        return res.status(errorStatus).send({
            errors: inValidMessage
        });
    }

    interface BodyItemType {
        name: string;

    }

    // Check all rules with body
    reqBody.body.map((bodyItem: BodyItemType) => {
        const bodyName = bodyItem.name.split(' ').join('_');

        if (!reqBody.rules || !reqBody.rules[bodyName]) {
            isValidBody = false;
            inValidMessage.push(`${bodyName} ${RULE_DOES_NOT_EXIST_IN_RULE}`);
        }
        else if(reqBody.rules[bodyName].required
            && typeof reqBody.rules[bodyName].required !== "boolean") {
            isValidBody = false;
            inValidMessage.push(`${bodyName} ${REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`);
        }

    });

    if (!isValidBody) {
        return res.status(errorStatus).send({
            errors: inValidMessage
        });
    }

    const data = {
        userName: userName,
        rules: JSON.stringify(reqBody.rules),
        name: reqBody.name,
        body : JSON.stringify(reqBody.body),
        stored_in: randomCollectionName
    };

    createMethod(res, data, ItemsModel);
}


