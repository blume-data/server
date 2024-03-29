import mongoose, {Schema} from 'mongoose';

interface FileAttrs {
    clientUserName: string;
    fileName: string; //unique

    path?: string;
    isVerified?: boolean;
    // png, image, video or pdf
    type?: string;
    fileId?: string;

    height?: number;
    width?: number;
    size?: number;

    thumbnailUrl?: string;
    createdBy: string;
    createdAt: Date;
}

interface FileModelType extends mongoose.Model<FileDoc> {
    build(attrs: FileAttrs): FileDoc;
}

interface FileDoc extends mongoose.Document {
    clientUserName: string;
    fileName: string; //unique

    path?: string;
    isVerified?: boolean;
    // png, image, video or pdf
    type?: string;
    fileId?: string;

    height?: number;
    width?: number;
    size?: number;

    thumbnailUrl?: string;
    createdBy: string;
    createdAt: Date;
}

const FileSchemaType = new mongoose.Schema(
    {
        description: String,
        clientUserName: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true,
            unique: true
        },
        fileId: {
            type: String
        },
        thumbnailUrl: {
            type: String
        },
        path: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        type: {
            type: String
        },

        height: Number,
        width: Number,
        size: Number,

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'ClientUser',
            required: true
        },
        createdAt: Date
    }
);

const FileModelName = 'FileModel';

FileSchemaType.statics.build = (attrs: FileAttrs) => {
    return new FileModel(attrs);
};

const FileModel = mongoose.model<FileDoc, FileModelType>(FileModelName, FileSchemaType);

export {FileModel};