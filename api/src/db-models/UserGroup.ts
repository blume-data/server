import mongoose, { Schema } from 'mongoose';

interface UserGroupAttrs {

    clientUserName: string;
    applicationName: string;
    env: string;
    name: string;
    description: string;

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
    
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

const Session = new mongoose.Schema(
    {
        applicationName: String,
        env: String,
        jwtId: String,
        name: {
            type: String,
            required: true
        },
        clientUserName: String,
        description: String,

        updatedAt : { type: Date },
        updatedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        createdAt : { type: Date },
        createdBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
    }
);

Session.statics.build = (attrs: UserGroupAttrs) => {
    return new UserGroupModel(attrs);
};

const UserGroupModel = mongoose.model<UserGroupDoc, UserGroupModelType>('UserGroupModel', Session);

export { UserGroupModel };