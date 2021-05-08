import mongoose from 'mongoose';

interface SessionAttrs {
    clientType: string;
    userName: string;
    clientUserName: string;
    jwtId: string;
    selectedApplicationName: string;
    selectedEnv: string;
    userAgent: any;
    isActive: boolean;

    createdAt: Date;
}

interface SessionModelType extends mongoose.Model<SessionDoc> {
    build(attrs: SessionAttrs): SessionDoc;
}

interface SessionDoc extends mongoose.Document {
    clientType: string;
    userName: string;
    jwtId: string;
    clientUserName: string;
    selectedApplicationName: string;
    selectedEnv: string;
    userAgent: any;
    isActive: boolean;

    createdAt: Date;
}

const Session = new mongoose.Schema(
    {
        userAgent: {type: Object},
        clientType: {
            type: String,
            required: true
        },
        jwtId: String,
        userName: {
            type: String,
            required: true
        },
        clientUserName: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean
        },
        selectedApplicationName: {
            type: String
        },
        selectedEnv: {
            type: String
        },
        createdAt: {
            type: Date,
            default: new Date()
        }
    }
);

Session.statics.build = (attrs: SessionAttrs) => {
    return new SessionModel(attrs);
};

const SessionModel = mongoose.model<SessionDoc, SessionModelType>('SessionModel', Session);

export { SessionModel };