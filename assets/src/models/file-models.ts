import mongoose from 'mongoose';

interface FileAttrs {
    clientUserName: string;
    fileName: string; //unique
    isVerified: boolean;
    type: string;
    url: string;
}

interface FileModelType extends mongoose.Model<FileDoc> {
    build(attrs: FileAttrs): FileDoc;
}

interface FileDoc extends mongoose.Document {
    clientUserName: string;
    fileName: string; //unique
    isVerified: boolean;
    type: string;
    url: string;
}

const File = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true
        },
        clientUserName: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        type: {
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

File.statics.build = (attrs: FileAttrs) => {
    return new FileModel(attrs);
};

const FileModel = mongoose.model<FileDoc, FileModelType>('FileModel', File);

export { FileModel };