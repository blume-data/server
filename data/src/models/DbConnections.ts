import mongoose from 'mongoose';

interface DbCollectionAttrs {
    count: number;
    name: string;
}

interface DbCollectionModel extends mongoose.Model<DbCollectionDoc> {
    build(attrs: DbCollectionAttrs): DbCollectionDoc;
}

interface DbCollectionDoc extends mongoose.Document {
    count: number;
    name: string;
    created_at: string;
}

const DbCollection = new mongoose.Schema(
    {
        count: {
            type: Number,
            required: true
        },
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

DbCollection.statics.build = (attrs: DbCollectionAttrs) => {
    return new DbCollectionModel(attrs);
};

const DbCollectionModel = mongoose.model<DbCollectionDoc, DbCollectionModel>('DbCollectionModel', DbCollection);

export { DbCollectionModel };
