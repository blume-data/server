import {
    CLIENT_USER_MODEL_NAME,
    ClientUserAttrs,
    ClientUserDoc,
    ClientUserModel as cm,
    clientUserSchema
} from "@ranjodhbirkaur/common";
import mongoose from "mongoose";

clientUserSchema.statics.build = (attrs: ClientUserAttrs) => {
    return new MainUserModel(attrs);
};

export const MainUserModel = mongoose.model<ClientUserDoc, cm>(CLIENT_USER_MODEL_NAME, clientUserSchema);