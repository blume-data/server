import { randomBytes } from 'crypto';
import mongoose, {Schema} from 'mongoose';
import {storeMongoConnection} from './connections';
import {RuleType} from "./interface";
import {BOOLEAN_FIElD_TYPE, DATE_FIElD_TYPE, DECIMAL_FIELD_TYPE, INTEGER_FIElD_TYPE} from "@ranjodhbirkaur/constants";
import {ENTRY_LANGUAGE_PROPERTY_NAME} from "./constants";
import {APPLICATION_NAME, CLIENT_USER_NAME} from "@ranjodhbirkaur/common";

export const RANDOM_STRING = function (minSize=10) {
    return randomBytes(minSize).toString('hex')
};

export const RANDOM_COLLECTION_NAME = function (min=1, max=1010) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

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

export function createModel(params: CreateModelType) {
    const {rules, name, applicationName, clientUserName} = params;
    const CollectionName = `${name}_${applicationName}_${clientUserName}`;
    const Schema = mongoose.Schema;
    let schemaData = {};
    // Create the schema
    rules.forEach((rule: any) => {

        if(rule.type === INTEGER_FIElD_TYPE || rule.type === DECIMAL_FIELD_TYPE) {
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
        createdAt : { type: Date },
        updatedAt : { type: Date },
        deletedAt : { type: Date },
        isDeleted: {type: Boolean, default: false},
        isPublished: {type: Boolean, default: true},
    };

    const schema = new Schema(schemaData, {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        },
        strict: false
    });

    if (process.env.NODE_ENV !== 'test') {
        const dbConnection = storeMongoConnection;
        if(dbConnection) {
            try {
                return dbConnection.model(name, schema);
            }
            catch (e) {
                return dbConnection.model(name);
            }
        }
        else {
            return null;
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
