import mongoose from 'mongoose';

interface CollectionAttrs {
    clientUserName : string;
    applicationName: string;
    env: string;

    rules: string;
    name: string;
    description: string;
    displayName: string;
    isPublic: boolean;
    isEnabled?: boolean;
    metaData?: string;

    updatedBy: string;
    updatedAt?: string;
}

interface CollectionModel extends mongoose.Model<CollectionDoc> {
    build(attrs: CollectionAttrs): CollectionDoc;
}

interface CollectionDoc extends mongoose.Document {
    clientUserName : string;
    applicationName: string;
    env: string;

    rules: string;
    name: string;
    description: string;
    displayName: string;
    isPublic: boolean;
    isEnabled: boolean;
    metaData?: string;

    updatedBy: string;
    updatedAt: string;
}

const Collection = new mongoose.Schema(
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
        rules : {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        displayName: {
            type: String,
            required: true
        },
        isPublic : {
            type: Boolean,
            default: false
        },
        isEnabled : {
            type: Boolean,
            default: true
        },
        metaData : {
            type: String
        },
        updatedBy : { type: String, default: '' },
        updatedAt : { type: Date, default: '' },
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

Collection.statics.build = (attrs: CollectionAttrs) => {
    return new CollectionModel(attrs);
};

const CollectionModel = mongoose.model<CollectionDoc, CollectionModel>('CollectionModel', Collection);

export { CollectionModel };
