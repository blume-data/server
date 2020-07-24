import mongoose from 'mongoose';

interface RolesAttrs {
    clientUserName : string;
    applicationName: string;
    env: string;
    language: string;

    permissions: string[];
    name: string;
    created_at?: string;
}

interface RolesModel extends mongoose.Model<RolesDoc> {
    build(attrs: RolesAttrs): RolesDoc;
}

interface RolesDoc extends mongoose.Document {
    clientUserName : string;
    applicationName: string;
    env: string;
    language: string;

    permissions: string[];
    name: string;
    created_at: string;
}

const Roles = new mongoose.Schema(
    {
        clientUserName: {
            type: String,
            required: true
        },
        applicationName: {
            type: String,
            required: true
        },
        env: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true
        },

        permissions: [{
            type: String
        }],
        name: {
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

Roles.statics.build = (attrs: RolesAttrs) => {
    return new RolesModel(attrs);
};

const RolesModel = mongoose.model<RolesDoc, RolesModel>('RolesModel', Roles);

export { RolesModel };
