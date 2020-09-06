import mongoose from 'mongoose';

interface CollectionAttrs {
    clientUserName : string;
    applicationName: string;
    env: string;
    language: string;

    rules: string;
    name: string;
    connectionName: string;
    collectionType?: string;
    isPublic: boolean;
    isEnabled?: boolean;
    metaData?: string;
    created_at?: string;
}

interface CollectionModel extends mongoose.Model<CollectionDoc> {
    build(attrs: CollectionAttrs): CollectionDoc;
}

interface CollectionDoc extends mongoose.Document {
    clientUserName : string;
    applicationName: string;
    env: string;
    language: string;

    rules: string;
    name: string;
    connectionName: string;
    collectionType?: string;
    isPublic: boolean;
    isEnabled?: boolean;
    metaData?: string;
    created_at?: string;
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
        language: {
            type: String,
            default: true
        },

        rules : {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        connectionName: {
            type: String,
            required: true
        },
        collectionType: {
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

Collection.statics.build = (attrs: CollectionAttrs) => {
    return new CollectionModel(attrs);
};

const CollectionModel = mongoose.model<CollectionDoc, CollectionModel>('CollectionModel', Collection);

export { CollectionModel };
