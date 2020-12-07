import mongoose from 'mongoose';

interface FileAttrs {
    url: string;
    name: string;
}

interface FileModelType extends mongoose.Model<FileDoc> {
    build(attrs: FileAttrs): FileDoc;
}

interface FileDoc extends mongoose.Document {
    url: string;
    name: string;
}

const File = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        url: {
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