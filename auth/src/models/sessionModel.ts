import mongoose from 'mongoose';

interface SessionAttrs {
    authToken: string;
    clientType: string;
    userName: string;
    clientUserName: string;
    selectedApplicationName: string;
    selectedLanguage: string;
    selectedEnv: string;
    createdAt: string;
}

interface SessionModelType extends mongoose.Model<SessionDoc> {
    build(attrs: SessionAttrs): SessionDoc;
}

interface SessionDoc extends mongoose.Document {
    authToken: string;
    clientType: string;
    userName: string;
    clientUserName: string;
    selectedApplicationName: string;
    selectedLanguage: string;
    selectedEnv: string;
    createdAt: string;
}

const Session = new mongoose.Schema(
    {
        authToken: {
            type: String,
            required: true
        },
        clientType: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        clientUserName: {
            type: String,
            required: true
        },
        selectedApplicationName: {
            type: String
        },
        selectedLanguage: {
            type: String
        },
        selectedEnv: {
            type: String
        },
        createdAt: {
            type: Date,
            default: new Date()
        }
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

Session.statics.build = (attrs: SessionAttrs) => {
    return new SessionModel(attrs);
};

const SessionModel = mongoose.model<SessionDoc, SessionModelType>('SessionModel', Session);

export { SessionModel };
