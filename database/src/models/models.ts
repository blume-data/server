import mongoose from 'mongoose';

interface DataBaseModelsAttrs {
    modelName: string;
    clientUserName: string;
    applicationName: string;
    isWritable: boolean;
}

interface DataBaseModelsModel extends mongoose.Model<DataBaseModelsDoc> {
    build(attrs: DataBaseModelsAttrs): DataBaseModelsDoc;
}

interface DataBaseModelsDoc extends mongoose.Document {
    modelName: string;
    clientUserName: string;
    applicationName: string;
    isWritable: boolean;
}

const DataBaseModels = new mongoose.Schema(
    {
        modelName: {
            type: String,
            required: true
        },
        isWritable: {
            type: Boolean,
            required: true
        },
        clientUserName: {
            type: String,
            required: true
        },
        applicationName: {
            type: String,
            required: true
        }
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

DataBaseModels.statics.build = (attrs: DataBaseModelsAttrs) => {
    return new DataBaseModelsModel(attrs);
};

const DataBaseModelsModel = mongoose.model<DataBaseModelsDoc, DataBaseModelsModel>('DataBaseModelsModel', DataBaseModels);

export { DataBaseModelsModel };
