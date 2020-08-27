import {NextFunction, Request, Response} from "express";
import {RuleType} from "../../../util/interface";
import {COLLECTION_TYPES, errorStatus, SUPPORTED_DATA_TYPES} from "../../../util/constants";
import {
    DEFAULT_VALUE_SHOULD_BE_OF_SPECIFIED_TYPE,
    EMAIL_PROPERTY_IN_RULES_SHOULD_BE_STRING, INVALID_RULES_MESSAGE,
    IS_EMAIL_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    IS_PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_STRING,
    REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    UNIQUE_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN
} from "../../../Controllers/Messages";

export async function validateCollections(req: Request, res: Response, next: NextFunction) {

    const reqBody = req.body;
    let isValidBody = true;
    let inValidMessage = [];

    // Validate Rules
    if (reqBody.rules && typeof reqBody.rules === 'object' && reqBody.rules.length) {
        if (reqBody.collectionType && !COLLECTION_TYPES.includes(reqBody.collectionType)) {
            isValidBody = false;
            inValidMessage.push({
                message: `${reqBody.collectionType} is not a valid collectionType`,
                field: 'collectionType'
            });
        }

        reqBody.rules.forEach((rule: RuleType) => {

            // Check required property
            if (rule.required !== undefined && typeof rule.required !== 'boolean') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`,
                    field: 'rules'
                });
            }

            // Check unique property
            if (rule.unique !== undefined && typeof rule.unique !== 'boolean') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${UNIQUE_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`,
                    field: 'rules'
                });
            }

            // Check ifEmail property
            if (rule.isEmail !== undefined && typeof rule.isEmail !== 'boolean') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${IS_EMAIL_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`,
                    field: 'rules'
                });
            }
            else if(rule.isEmail && typeof rule.isEmail === 'boolean' && rule.type !== 'string') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${EMAIL_PROPERTY_IN_RULES_SHOULD_BE_STRING}`,
                    field: 'rules'
                })
            }

            // Check isPassword property
            if (rule.isPassword !== undefined && typeof rule.isPassword !== 'boolean') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${IS_PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`,
                    field: 'rules'
                });
            }
            else if(rule.isPassword && typeof rule.isPassword === 'boolean' && rule.type !== 'string') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_STRING}`,
                    field: 'rules'
                })
            }

            // check default property
            if (rule.default && typeof rule.default !== rule.type) {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${DEFAULT_VALUE_SHOULD_BE_OF_SPECIFIED_TYPE}${rule.type}`,
                    field: 'rules'
                });
            }

            // Validate rule type
            if (typeof rule.type === 'string' && SUPPORTED_DATA_TYPES.includes(rule.type)) {
                // remove all the spaces from name
                rule.name = rule.name.split(' ').join('_');
            }

            else {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name} is of invalid type ${rule.type}`,
                    field: 'rules'
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

    // Validate unique name in the rules
    if (reqBody.rules && typeof reqBody.rules === 'object' && reqBody.rules.length) {
        const names: string[] = [];
        reqBody.rules.forEach((rule: RuleType) => {
            const exist = names.find(item => item === rule.name);
            if (exist) {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name} is already present in rules`,
                    field: 'rules'
                })
            }
            else {
                names.push(rule.name);
            }
        });
    }

    if (!isValidBody) {
        return res.status(errorStatus).send({
            errors: inValidMessage
        });
    }
    else {
        next();
    }
}