import { randomBytes } from 'crypto';
import mongoose from 'mongoose';
import { getConnection } from './connections';
import {RuleType} from "./interface";

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
    connectionName: string;
    name: string;
}

export function createModel(params: CreateModelType) {
    const {rules, name, connectionName} = params;
    const CollectionName = name.split(' ').join('_');
    const Schema = mongoose.Schema;
    let schemaData = {};
    // Create the schema
    rules.forEach((rule: any) => {
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

    if (process.env.NODE_ENV !== 'test') {
        const dbConnection = getConnection(connectionName);
        try {
            if (dbConnection) {
                return dbConnection.model(connectionName, schema);
            }
            else {
                return null;
            }
        }
        catch (e) {
            return dbConnection.model(connectionName);
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
