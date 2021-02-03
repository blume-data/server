import mongoose, {Schema} from 'mongoose';

interface FileAttrs {
    clientUserName: string;
    fileName: string; //unique
    isVerified: boolean;
    type: string;
    createdBy: string;
}

interface FileModelType extends mongoose.Model<FileDoc> {
    build(attrs: FileAttrs): FileDoc;
}

interface FileDoc extends mongoose.Document {
    clientUserName: string;
    fileName: string; //unique
    isVerified: boolean;
    type: string;
    createdBy: string;
}

const File = new mongoose.Schema(
    {

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
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'ClientUser',
            required: true
        }
    }
);

File.statics.build = (attrs: FileAttrs) => {
    return new FileModel(attrs);
};

const FileModel = mongoose.model<FileDoc, FileModelType>('FileModel', File);

export { FileModel };