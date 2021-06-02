import mongoose, { Schema } from 'mongoose';

interface UserGroupAttrs {

    clientUserName: string;
    applicationName: string;
    env: string;
    name: string;
    description: string;
    id: string;

    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

interface UserGroupModelType extends mongoose.Model<UserGroupDoc> {
    build(attrs: UserGroupAttrs): UserGroupDoc;
}

interface UserGroupDoc extends mongoose.Document {
    
    clientUserName: string;
    applicationName: string;
    env: string;
    name: string;
    description: string;
    id: string;
    
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

const UserGroupSchema = new mongoose.Schema(
    {
        
        env: String,
        name: {
            type: String,
            required: true
        },
        clientUserName: String,
        applicationName: String,
        description: String,
        id: String,
        updatedAt : { type: Date },
        updatedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        createdAt : { type: Date },
        createdBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
    }
);

UserGroupSchema.statics.build = (attrs: UserGroupAttrs) => {
    return new UserGroupModel(attrs);
};

const UserGroupModel = mongoose.model<UserGroupDoc, UserGroupModelType>('UserGroupModel', UserGroupSchema, 'usergroupmodel');

export { UserGroupModel };