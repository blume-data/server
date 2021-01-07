import {ClientUserDoc, ClientUserModel as cm, clientUserSchema} from "@ranjodhbirkaur/common";
import mongoose from "mongoose";

export const ClientUserModel = mongoose.model<ClientUserDoc, cm>('ClientUser', clientUserSchema);