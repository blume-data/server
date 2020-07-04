import mongoose from 'mongoose';

interface ConnectionAttrs {
    count: number;
    name: string;
}

interface ConnectionModel extends mongoose.Model<ConnectionDoc> {
    build(attrs: ConnectionAttrs): ConnectionDoc;
}

interface ConnectionDoc extends mongoose.Document {
    count: number;
    name: string;
    created_at?: string;
}

const Connection = new mongoose.Schema(
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

Connection.statics.build = (attrs: ConnectionAttrs) => {
    return new ConnectionModel(attrs);
};

const ConnectionModel = mongoose.model<ConnectionDoc, ConnectionModel>('ConnectionModel', Connection);

export { ConnectionModel };
