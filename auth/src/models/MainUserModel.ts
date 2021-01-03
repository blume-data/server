import {getClientUserModel} from "@ranjodhbirkaur/common";
import { MongoConnection } from "../util/tools";

export const MainUserModel = getClientUserModel(MongoConnection);