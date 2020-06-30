import mongoose from 'mongoose';

interface ItemSchemaAttrs {
    userName : string,
    rules: string,
    name: string,
    body: string,
    storedIn: string,
    metaData?: string;
    isEnabled?: boolean;
}

interface ItemSchemaModel extends mongoose.Model<ItemSchemaDoc> {
    build(attrs: ItemSchemaAttrs): ItemSchemaDoc;
}

interface ItemSchemaDoc extends mongoose.Document {
    userName : string,
    rules: string,
    name: string,
    body: string,
    storedIn: string,
    metaData?: string;
    isEnabled?: boolean;
    created_at: string;
}

const ItemSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true
        },
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
        storedIn: {
            type: String,
            required: true
        },
        metaData : {
            type: String
        },
        isEnabled : {
            type: Boolean,
            required: true,
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

ItemSchema.statics.build = (attrs: ItemSchemaAttrs) => {
    return new ItemsModel(attrs);
};

const ItemsModel = mongoose.model<ItemSchemaDoc, ItemSchemaModel>('ItemsModel', ItemSchema);

export { ItemsModel };
