import mongoose from 'mongoose';

interface CollectionAttrs {
    userName : string;
    rules: string;
    name: string;
    dbName: string;
    language: string;
    connectionName: string;
    metaData?: string;
    isEnabled?: boolean;
}

interface CollectionModel extends mongoose.Model<CollectionDoc> {
    build(attrs: CollectionAttrs): CollectionDoc;
}

interface CollectionDoc extends mongoose.Document {
    userName : string;
    rules: string;
    name: string;
    dbName: string;
    language: string;
    connectionName: string;
    metaData?: string;
    isEnabled?: boolean;
    created_at: string;
}

const Collection = new mongoose.Schema(
    {
        rules : {
            type: String,
            required: true
        },
        userName : {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        dbName: {
            type: String,
            required: true
        },
        connectionName: {
            type: String,
            required: true
        },
        metaData : {
            type: String
        },
        isEnabled : {
            type: Boolean,
            default: true
        },
        language: {
            type: String,
            default: true
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
