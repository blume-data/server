import { randomBytes } from 'crypto';
import mongoose, {set} from "mongoose";
import {RuleType} from "./interface";
import {DATE_TYPE, HTML_TYPE} from "./constants";
import {BadRequestError} from "@ranjodhbirkaur/common";

export const RANDOM_STRING = function (minSize=10) {
    return randomBytes(minSize).toString('hex')
};

export const RANDOM_COLLECTION_NAME = function (min=1, max=1010) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

interface CreateModelType {
    rules: {name: string; type: string}[];
    dbName: string;
    connectionName: string;
    name: string;
}

export function createModel(params: CreateModelType) {
    const {rules, name, dbName, connectionName} = params;
    const CollectionName = name.split(' ').join('_');
    const Schema = mongoose.Schema;
    let schemaData = {};
    // Create the schema
    rules.forEach((rule: RuleType) => {
        switch (rule.type) {
            case 'string': {
                schemaData = {
                    ...schemaData,
                    [rule.name]: {
                        type: String,
                        required: !!rule.required,
                        unique: !!rule.unique
                    }
                };
                break;
            }
            case 'number': {
                schemaData = {
                    ...schemaData,
                    [rule.name] : {
                        type: Number,
                        required: !!rule.required,
                        unique: !!rule.unique
                    },
                };
                break;
            }
            case 'boolean': {
                schemaData = {
                    ...schemaData,
                    [rule.name]: {
                        type: Boolean,
                        required: !!rule.required,
                        unique: !!rule.unique
                    }
                };
                break;
            }
            case DATE_TYPE: {
                schemaData = {
                    ...schemaData,
                    [rule.name]: {
                        type: Date,
                        required: !!rule.required,
                    }
                };
                break;
            }
            case HTML_TYPE: {
                schemaData = {
                    ...schemaData,
                    [rule.name]: {
                        type: String,
                        required: !!rule.required,
                    }
                };
                break;
            }
        }
    });

    schemaData = {
        ...schemaData,
        created_at : { type: Date },
        updated_at : { type: Date },
        deleted_at : { type: Date },
    };

    const schema = new Schema(schemaData, {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    });
    console.log('connectionName', connectionName);
    console.log('dbName', dbName);

    if (process.env.NODE_ENV !== 'test') {
        try {
            const dbConnection = mongoose.createConnection(`mongodb://data-mongo-${connectionName}-srv/${dbName}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            });

            return {
                model: dbConnection.model(CollectionName, schema),
                dbConnection
            };
        }
        catch(error) {
            throw new BadRequestError('Error in creating connection');
        }
    }
    else {
        const dbConnection = mongoose.createConnection(`mongodb://test:test123@ds339968.mlab.com:39968/test-auth`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        return {
            model: dbConnection.model(CollectionName, schema),
            dbConnection
        };
    }
}