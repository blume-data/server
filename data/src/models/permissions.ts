import mongoose from 'mongoose';

interface PermissionsAttrs {
    name: string;
    userName: string;
    created_at: string;
}

interface PermissionsModel extends mongoose.Model<PermissionsDoc> {
    build(attrs: PermissionsAttrs): PermissionsDoc;
}

interface PermissionsDoc extends mongoose.Document {
    name: string;
    userName: string;
    created_at: string;
}

const Permissions = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        userName: {
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

Permissions.statics.build = (attrs: PermissionsAttrs) => {
    return new PermissionsModel(attrs);
};

const PermissionsModel = mongoose.model<PermissionsDoc, PermissionsModel>('PermissionsModel', Permissions);

export { PermissionsModel };
