import mongoose, {SchemaDefinition} from 'mongoose';
export interface RootUserAttrs {
    userName: string;
    jwtId: string;
    password: string;
    isEnabled?: boolean;
    createdAt?: string;
}

export interface RootUserDoc extends mongoose.Document {
    userName: string;
    jwtId: string;
    password: string;
    isEnabled?: boolean;
    createdAt: string;
}

export function getRootUserSchema(properties: SchemaDefinition) {
    return new mongoose.Schema(
        {
            ...properties,
            userName: {
                type: String,
                required: true
            },
            jwtId: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            isEnabled: {
                type: Boolean,
                default: true
            },
            createdAt: {
                type: String,
                default: new Date()
            }
        }
    );
}
