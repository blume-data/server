import {NextFunction, Request, Response} from "express";
import {RuleType} from "../../../util/interface";
import {
    INVALID_RULES_MESSAGE,
    REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    UNIQUE_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN
} from "../../../Controllers/Messages";
import {errorStatus} from "@ranjodhbirkaur/common";
import {
    DECIMAL_FIELD_TYPE,
    FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN,
    FIELD_CUSTOM_ERROR_MSG_MIN_MAX,
    FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN,
    INTEGER_FIElD_TYPE,
    JSON_FIELD_TYPE, REFERENCE_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE,
    SUPPORTED_FIELDS_TYPE
} from "@ranjodhbirkaur/constants";
import {isValidRegEx} from "../../../util/methods";

function hasSIDType(type: string) {
    const SID = [INTEGER_FIElD_TYPE, DECIMAL_FIELD_TYPE, SHORT_STRING_FIElD_TYPE];
    return SID.includes(type);
}

function isSSType(type: string) {
    return SHORT_STRING_FIElD_TYPE === type;
}

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
                name: `${rule.name}`,
                type: `${rule.type}`,
                description: `${rule.description}`,
                displayName: `${rule.displayName}`,
                max: 0,
                min: 0,
                unique: Boolean(rule.unique),
                required: Boolean(rule.required),
                default: ``,
                [FIELD_CUSTOM_ERROR_MSG_MIN_MAX]: '',
                [FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN]: '',
                [FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN]: '',
                matchSpecificPattern: '',
                prohibitSpecificPattern: '',
                onlyAllowedValues: ''
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
                    message: `${rule.name}'s displayName is required`,
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
                    message: `${rule.name}'s ${REQUIRED_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`,
                    field: 'rules'
                });
            }

            // check type property
            if(!rule.type) {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}'s type is required`,
                    field: 'rules'
                });
            }
            else if(!SUPPORTED_FIELDS_TYPE.includes(rule.type)) {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}'s type is not valid`,
                    field: 'rules'
                });
            }

            // Check unique property
            if(!rule.unique) {
                rule.unique = false;
            }
            else if(typeof rule.unique !== 'boolean') {
                isValidBody = false;
                inValidMessage.push({
                    message: `${rule.name}'s ${UNIQUE_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`,
                    field: 'rules'
                });
            }

            // check max property
            if(rule.max && hasSIDType(rule.type)) {
                if(Number(rule.max) > 50000 && rule.type === SHORT_STRING_FIElD_TYPE) {
                    parsedRule.max = 50000;
                }
                else {
                    parsedRule.max = Number(rule.max);
                }
            }

            // check min property
            if(rule.min && hasSIDType(rule.type)) {
                if(parsedRule.max < Number(rule.min)) {
                    isValidBody = false;
                    inValidMessage.push({
                        message: `${rule.name}'s minimum limit cannot be greater then maximum limit`
                    });
                }
                else {
                    parsedRule.min = Number(rule.min);
                }
            }

            // check default in property
            if(rule.default && ![JSON_FIELD_TYPE, REFERENCE_FIELD_TYPE].includes(rule.type)) {
                parsedRule.default = `${rule.default}`;
            }

            //check match specific pattern property
            if(rule.matchSpecificPattern && isSSType(rule.type)) {
                if(isValidRegEx(rule.matchSpecificPattern)) {
                    parsedRule.matchSpecificPattern = `${rule.matchSpecificPattern}`;
                }
                else {
                    isValidBody = false;
                    inValidMessage.push({
                        message: `${rule.name}'s matchSpecificPattern is not a valid Regex`,
                        field: 'rules'
                    })
                }
            }

            //check match prohibited pattern property
            if(rule.prohibitSpecificPattern && isSSType(rule.type)) {
                if(isValidRegEx(rule.prohibitSpecificPattern)) {
                    parsedRule.prohibitSpecificPattern = `${rule.prohibitSpecificPattern}`;
                }
                else {
                    isValidBody = false;
                    inValidMessage.push({
                        message: `${rule.name}'s prohibitSpecificPattern is not a valid Regex`,
                        field: 'rules'
                    })
                }
            }

            //check FIELD_CUSTOM_ERROR_MSG_MIN_MAX property
            if(rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX] && hasSIDType(rule.type)) {
                parsedRule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX] = `${rule[FIELD_CUSTOM_ERROR_MSG_MIN_MAX]}`;
            }

            //check FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN property
            if(rule[FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN] && isSSType(rule.type)) {
                parsedRule[FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN] = `${rule[FIELD_CUSTOM_ERROR_MSG_MATCH_SPECIFIC_PATTERN]}`;
            }

            //check FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN property
            if(rule[FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN] && isSSType(rule.type)) {
                parsedRule[FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN] = `${rule[FIELD_CUSTOM_ERROR_MSG_PROHIBIT_SPECIFIC_PATTERN]}`;
            }

            // check allowed values
            if(rule.onlyAllowedValues && hasSIDType(rule.type)) {
                parsedRule.onlyAllowedValues = rule.onlyAllowedValues;
            }

            // If valid rule
            parsedRules.push(parsedRule);
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
        reqBody.rules = parsedRules;
        next();
    }
}