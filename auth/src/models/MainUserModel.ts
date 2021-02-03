import {ClientUserDoc, ClientUserModel as cm, clientUserSchema} from "@ranjodhbirkaur/common";
import mongoose from "mongoose";

export const MainUserModel = mongoose.model<ClientUserDoc, cm>('ClientUser', clientUserSchema);