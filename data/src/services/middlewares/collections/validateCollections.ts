import {NextFunction, Request, Response} from "express";
import {RuleType} from "../../../util/interface";
import {
    EMAIL_PROPERTY_IN_RULES_SHOULD_BE_STRING, INVALID_RULES_MESSAGE,
    IS_EMAIL_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    IS_PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_STRING,
    REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    UNIQUE_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN
} from "../../../Controllers/Messages";
import {errorStatus} from "@ranjodhbirkaur/common";
import {SHORT_STRING_FIElD_TYPE, SUPPORTED_FIELDS_TYPE, trimCharactersAndNumbers} from "@ranjodhbirkaur/constants";

export async function validateCollections(req: Request, res: Response, next: NextFunction) {

    const reqBody = req.body;
    let isValidBody = true;
    let inValidMessage = [];
    const reqMethod = req.method;
    const parsedRules: RuleType[] = [];

    // Validate Rules
    if (reqBody.rules && typeof reqBody.rules === 'object' && reqBody.rules.length) {

        reqBody.rules.forEach((rule: RuleType) => {

            let parsedRule: RuleType = {
                name: rule.name,
                type: rule.type
            };

            // check if name is there
            if(!rule.name) {
                isValidBody = false;
                inValidMessage.push({
                    message: `name is required`,
                    field: 'rules'
                });
            }
            // check if displayName is present
            if(!rule.displayName) {
                isValidBody = false;
                inValidMessage.push({
                    message: `displayName is required`,
                    field: 'rules'
                });
            }

            // check required rule
            if(!rule.required) {
                rule.required = false;
            }
            else if(typeof rule.required !== 'boolean') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`,
                    field: 'rules'
                });
            }

            // Check unique property
            if(!rule.unique) {
                rule.unique = false;
            }
            else if(rule.unique !== undefined && typeof rule.unique !== 'boolean') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${UNIQUE_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`,
                    field: 'rules'
                });
            }

            // Check ifEmail property
            if(!rule.isEmail) {
                rule.isEmail = false;
            }
            else if(rule.isEmail !== undefined && typeof rule.isEmail !== 'boolean') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}: ${IS_EMAIL_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`,
                    field: 'rules'
                });
            }
            else if(rule.isEmail && typeof rule.isEmail === 'boolean' && rule.type !== SHORT_STRING_FIElD_TYPE) {
                rule.isEmail = false;
            }

            // Validate rule type
            if (SUPPORTED_FIELDS_TYPE.includes(rule.type)) {
                // remove all the spaces from name
                rule.name = trimCharactersAndNumbers(rule.name);
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
    // rules is option in put request
    else if(reqMethod === 'POST') {
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