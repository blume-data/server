import { clientUserType } from '@ranjodhbirkaur/constants';
import { DateTime } from 'luxon';
import mongoose, { Schema } from 'mongoose';
import {CLIENT_USER_MODEL_NAME} from "../util/common-module";
interface ClientUserAttrs {
    email?: string;
    password: string;
    firstName?: string;
    lastName?: string;
    type?: string;
    userGroupIds?: string[];
    clientUserName?: string;
    applicationName?: string;
    env?: string;
    id: string;
    userName: string;
    jwtId: string;
    isEnabled?: boolean;
    createdAt?: string;
    details?: any;
}
interface ClientUserDoc extends mongoose.Document {
    email?: string;
    firstName?: string;
    lastName?: string;
    type?: string;
    userGroupIds?: string[];
    clientUserName?: string;
    applicationName?: string;
    env?: string;
    id: string;
    userName: string;
    jwtId: string;
    password: string;
    isEnabled?: boolean;
    createdAt: string;
    details?: any;
}

function getRootUserSchema() {
    return new mongoose.Schema(
        {
            email: {
                type: String,
                lowercase:true
            },
            firstName : {
                type: String
            },
            lastName : {
                type: String
            },
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
                default: DateTime.local().setZone('UTC').toJSDate()
            },
            type: {
                type: String,
                default: clientUserType
            },
            id: String,
            details: Object,
            clientUserName: String,
            applicationName: String,
            env: String,
            userGroupIds: [String],
        }, 
        { 
            toJSON: { virtuals: true },
            toObject: { virtuals: true }
        }
    );
}



interface ClientUserModel extends mongoose.Model<ClientUserDoc> {
    build(attrs: ClientUserAttrs): ClientUserDoc;
}

const clientUserSchema = getRootUserSchema();

clientUserSchema.virtual('userGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'userGroupIds', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
  
  });

clientUserSchema.statics.build = (attrs: ClientUserAttrs) => {
    return new UserModel(attrs);
};

export const UserModel = mongoose.model<ClientUserDoc, ClientUserModel>(CLIENT_USER_MODEL_NAME, clientUserSchema);