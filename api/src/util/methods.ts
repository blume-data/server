import {Request, Response} from 'express';
import mongoose from 'mongoose';
import {
    BOOLEAN_FIElD_TYPE,
    DATE_AND_TIME_FIElD_TYPE,
    DATE_FIElD_TYPE,
    INTEGER_FIElD_TYPE, PUBLISHED_ENTRY_STATUS,
    JSON_FIELD_TYPE, ONE_TO_MANY_RELATION, ONE_TO_ONE_RELATION, REFERENCE_FIELD_TYPE,
    ARCHIVED_ENTRY_STATUS, RuleType,
    DELETED_ENTRY_STATUS, DRAFT_ENTRY_STATUS, MEDIA_FIELD_TYPE, SINGLE_ASSETS_TYPE, MULTIPLE_ASSETS_TYPE,
} from "@ranjodhbirkaur/constants";
import {
    ENTRY_LANGUAGE_PROPERTY_NAME, TIMEZONE_DATE_CONSTANT,
} from "./constants";
import {
    APPLICATION_NAME,
    CLIENT_USER_NAME,
    okayStatus
} from "./common-module";
import {getCollection} from "../modules/entries/Controllers/StoreController";

export function isValidRegEx(reg: string) {
    let isValid = true;
    try {
        new RegExp(reg);
    } catch(e) {
        isValid = false;
    }
    return isValid;
}

interface CreateModelType {
    rules: RuleType[];
    name: string;
    [APPLICATION_NAME]: string;
    [CLIENT_USER_NAME]: string;
}

export function createStoreModelName(name: string, applicationName: string, clientUserName: string) {
    return `${name}_${applicationName}_${clientUserName}`;
}

export async function getModel(req: Request, modelName: string, applicationName: string, clientUserName: string) {
    const collection = await getCollection(req, modelName);
    if(collection) {
        const rules = JSON.parse(collection.rules);
        const model: any = createModel({
            rules,
            clientUserName,
            applicationName,
            name: modelName
        });
        return model;
    }
    return null;
}

export function createModelSchema(applicationName: string, clientUserName: string, rules: RuleType[]) {
    const Schema = mongoose.Schema;
    let schemaData = {};
    // Create the schema
    rules.forEach((rule: any) => {

        if(rule.type === INTEGER_FIElD_TYPE) {
            schemaData = {
                ...schemaData,
                [rule.name] : {
                    type: Number,
                    required: !!rule.required,
                    unique: !!rule.unique
                },
            };
        }
        else if(rule.type === BOOLEAN_FIElD_TYPE) {
            schemaData = {
                ...schemaData,
                [rule.name]: {
                    type: Boolean,
                    required: !!rule.required,
                    unique: !!rule.unique
                }
            };
        }
        else if(rule.type === DATE_FIElD_TYPE) {
            schemaData = {
                ...schemaData,
                [rule.name]: {
                    type: Date,
                    required: !!rule.required,
                }
            };
        }
        else if(rule.type === DATE_AND_TIME_FIElD_TYPE) {
            schemaData = {
                ...schemaData,
                [rule.name]: {
                    type: Date,
                    required: !!rule.required,
                },
                [`${rule.name}-${TIMEZONE_DATE_CONSTANT}`]: {
                    type: String,
                    required: !!rule.required
                }
            };
        }
        else if(rule.type === JSON_FIELD_TYPE) {

            schemaData = {
                ...schemaData,
                [rule.name]: {
                    type: Object,
                    required: !!rule.required
                }
            }
        }
        else if(rule.type === REFERENCE_FIELD_TYPE) {

            const ref = createStoreModelName(rule.referenceModelName, applicationName, clientUserName);

            if(rule.referenceModelType === ONE_TO_MANY_RELATION) {
                schemaData = {
                    ...schemaData,
                    [rule.name]: [{ type: Schema.Types.ObjectId, ref }]
                }
            }
            else if(rule.referenceModelType === ONE_TO_ONE_RELATION) {
                schemaData = {
                    ...schemaData,
                    [rule.name]: { type: Schema.Types.ObjectId, ref }
                }
            }
        }
        else if(rule.type === MEDIA_FIELD_TYPE) {

            const ref = 'FileModel';

            if(!rule.assetsType || rule.assetsType === SINGLE_ASSETS_TYPE) {
                schemaData = {
                    ...schemaData,
                    [rule.name]: { type: Schema.Types.ObjectId, ref }
                }
            }
            else if(rule.assetsType === MULTIPLE_ASSETS_TYPE) {
                schemaData = {
                    ...schemaData,
                    [rule.name]: [{ type: Schema.Types.ObjectId, ref}]
                }
            }
        }
        else {
            schemaData = {
                ...schemaData,
                [rule.name]: {
                    type: String,
                    required: !!rule.required,
                    unique: !!rule.unique
                }
            };
        }
    });

    schemaData = {
        ...schemaData,
        [ENTRY_LANGUAGE_PROPERTY_NAME]: String,
        deletedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        deletedAt : { type: Date },
        createdBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        createdAt : { type: Date },
        updatedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        updatedAt : { type: Date },

        status: {
            type: String,
            enum: [DELETED_ENTRY_STATUS, PUBLISHED_ENTRY_STATUS, ARCHIVED_ENTRY_STATUS, DRAFT_ENTRY_STATUS],
            default: DRAFT_ENTRY_STATUS
        }
    };

    return new Schema(schemaData, {
        strict: false
    });
}

export function createModel(params: CreateModelType) {
    const {rules, name, applicationName, clientUserName} = params;
    const CollectionName = createStoreModelName(name, applicationName, clientUserName);
    const schema = createModelSchema(applicationName, clientUserName, rules)

    if (process.env.NODE_ENV !== 'test') {
        try {
            return mongoose.model(CollectionName, schema);
        }
        catch (e) {
            return mongoose.model(CollectionName);
        }
    }
    else {
        const dbConnection = mongoose.createConnection(`mongodb://test:test123@ds339968.mlab.com:39968/test-auth`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        return dbConnection.model(CollectionName, schema);
    }
}

export function trimGetOnly(params?: string[] | string | null): string {
    if(typeof params === 'string') {
        return params;
    }
    else if(params && Array.isArray(params)) {
        return params.join(' ');
    }
    return `-${ENTRY_LANGUAGE_PROPERTY_NAME}`;
}

// send on id on create record
export function sendOkayResponse(res: Response, data?: object) {
    if(!data) {
        data = {
            status: 'okay'
        }
    }
    return res.status(okayStatus).send(data);
}
