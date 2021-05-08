import mongoose, {SchemaDefinition} from 'mongoose';
import {CLIENT_USER_MODEL_NAME} from "@ranjodhbirkaur/common";

export interface RootUserAttrs {
    userName: string;
    jwtId: string;
    password: string;
    isEnabled?: boolean;
    createdAt?: string;
}
interface ClientUserAttrs extends RootUserAttrs{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface RootUserDoc extends mongoose.Document {
    userName: string;
    jwtId: string;
    password: string;
    isEnabled?: boolean;
    createdAt: string;
}
interface ClientUserDoc extends RootUserDoc {
    email: string;
    firstName: string;
    lastName: string;
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

interface ClientUserModel extends mongoose.Model<ClientUserDoc> {
    build(attrs: ClientUserAttrs): ClientUserDoc;
}

const clientUserSchema = getRootUserSchema({
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase:true
    },
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    }
});

clientUserSchema.statics.build = (attrs: ClientUserAttrs) => {
    return new UserModel(attrs);
};

export const UserModel = mongoose.model<ClientUserDoc, ClientUserModel>(CLIENT_USER_MODEL_NAME, clientUserSchema);



