import mongoose from 'mongoose';

interface UserConnectionAttrs {
    clientUserName: string;
    connectionName: string;
}

interface UserConnectionModel extends mongoose.Model<UserConnectionDoc> {
    build(attrs: UserConnectionAttrs): UserConnectionDoc;
}

export interface UserConnectionDoc extends mongoose.Document {
    clientUserName: string;
    connectionName: string;
    created_at?: string;
}

const UserConnection = new mongoose.Schema(
    {
        clientUserName: {
            type: String,
            required: true,
            unique: true
        },
        connectionName: {
            type: String,
            required: true
        },
        created_at : { type: Date, default: Date.now }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

UserConnection.statics.build = (attrs: UserConnectionAttrs) => {
    return new UserConnectionModel(attrs);
};

const UserConnectionModel = mongoose.model<UserConnectionDoc, UserConnectionModel>('UserConnectionModel', UserConnection);

export { UserConnectionModel };