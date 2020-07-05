import { randomBytes } from 'crypto';
import mongoose from "mongoose";

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
    const Schema = mongoose.Schema;
    let schemaData = {};
    // Create the schema
    rules.forEach(rule => {
        switch (rule.type) {
            case 'string': {
                schemaData = {
                    ...schemaData,
                    [rule.name]: String
                };
                break;
            }
            case 'number': {
                schemaData = {
                    ...schemaData,
                    [rule.name] : Number
                };
                break;
            }
            case 'boolean': {
                schemaData = {
                    ...schemaData,
                    [rule.name]: Boolean
                }
            }
        }
    });

    schemaData = {
        ...schemaData,
        created_at : { type: Date, default: Date.now },
        updated_at : { type: Date },
        deleted_at : { type: Date },
    };

    const dbConnection = mongoose.createConnection(`mongodb://data-mongo-${connectionName}-srv/${dbName}`);

    const schema = new Schema(schemaData, {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    });

    return dbConnection.model(name, schema);
}