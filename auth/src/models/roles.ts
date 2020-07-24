import mongoose from 'mongoose';

interface RolesAttrs {
    // delete-comment
    // all-comment
    permissions: string[];
    name: string;
    // all means can access all languages
    language: string;
    clientUserName: string;
    applicationName: string;
    env: string;
}

interface RolesModel extends mongoose.Model<RolesDoc> {
    build(attrs: RolesAttrs): RolesDoc;
}

interface RolesDoc extends mongoose.Document {
    permissions: string[];
    name: string;
    language: string;
    clientUserName: string;
    applicationName: string;
    env: string;
    created_at: string;
}

const Roles = new mongoose.Schema(
    {
        language: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
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
        permissions: [{
            type: String
        }],
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
