import mongoose from 'mongoose';

interface UserJWTSAttrs {
    clientUserName?: string;
    type: string;
    jwtId: string;
    userName: string;
}

interface UserJWTSModel extends mongoose.Model<UserJWTSDoc> {
    build(attrs: UserJWTSAttrs): UserJWTSDoc;
}

interface UserJWTSDoc extends mongoose.Document {
    clientUserName?: string;
    type: string;
    jwtId: string;
    userName: string;
}

const UserJWTS = new mongoose.Schema(
    {
        clientUserName: {
            type: String
        },
        userName: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        jwtId: {
            type: String,
            required: true
        },
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

UserJWTS.statics.build = (attrs: UserJWTSAttrs) => {
    return new UserJWTSModel(attrs);
};

const UserJWTSModel = mongoose.model<UserJWTSDoc, UserJWTSModel>('UserJWTSModel', UserJWTS);

export { UserJWTSModel };
