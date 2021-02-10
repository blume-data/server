import {FileModelName, FileDoc, FileModelType, FileSchemaType, FileAttrs } from '@ranjodhbirkaur/common';
import mongoose from "mongoose";

FileSchemaType.statics.build = (attrs: FileAttrs) => {
    return new FileModel(attrs);
};

const FileModel = mongoose.model<FileDoc, FileModelType>(FileModelName, FileSchemaType);

export {FileModel};