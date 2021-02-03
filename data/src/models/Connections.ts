import mongoose from 'mongoose';

interface ConnectionAttrs {
    count: number;
    // type of connection
    // for free users
    // for client users
    type: string;
    name: string;
}

interface ConnectionModelType extends mongoose.Model<ConnectionDoc> {
    build(attrs: ConnectionAttrs): ConnectionDoc;
}

interface ConnectionDoc extends mongoose.Document {
    count: number;
    name: string;
    type: string;
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
        type: {
            type: String,
            required: true
        }
    }
);

Connection.statics.build = (attrs: ConnectionAttrs) => {
    return new ConnectionModel(attrs);
};

const ConnectionModel = mongoose.model<ConnectionDoc, ConnectionModelType>('ConnectionModel', Connection);

export { ConnectionModel };