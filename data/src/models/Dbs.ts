import mongoose from 'mongoose';

interface DbsAttrs {
    count: number;
    name: string;
    connectionName: string;
}

interface DbsModel extends mongoose.Model<DbsDoc> {
    build(attrs: DbsAttrs): DbsDoc;
}

export interface DbsDoc extends mongoose.Document {
    count: number;
    name: string;
    connectionName: string;
    created_at?: string;
}

const Dbs = new mongoose.Schema(
    {
        count: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        connectionName: {
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

Dbs.statics.build = (attrs: DbsAttrs) => {
    return new DbsModel(attrs);
};

const DbsModel = mongoose.model<DbsDoc, DbsModel>('DbsModel', Dbs);

export { DbsModel };
