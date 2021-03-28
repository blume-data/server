import {DateTime} from "luxon";
import {CollectionModel} from "../models/Collection";
import {JSON_FIELD_TYPE, SHORT_STRING_FIElD_TYPE} from "@ranjodhbirkaur/constants";
import {EventEmitter} from "events";
import {DataEventInstance} from "./index";

export const EVENT_TYPE_ENV_CREATED = 'EVENT_TYPE_ENV_CREATED';
interface OnEnvCreate {
    clientUserName: string;
    applicationName: string;
    env: string;
    userId: string;
}
export async function onEnvCreate(data: OnEnvCreate) {

    const {clientUserName, applicationName, env, userId} = data;

    const createdAt = DateTime.local().setZone('UTC').toJSDate();

    const newCollection = CollectionModel.build({
        clientUserName,
        isPublic: false,
        applicationName,
        rules: JSON.stringify([
            {name: 'title', description: 'Title of query', type: SHORT_STRING_FIElD_TYPE, required: true, unique: true},
            {name: 'description', description: 'Description of query', type: SHORT_STRING_FIElD_TYPE},
            {name: 'data', description: 'Data of query', type: JSON_FIELD_TYPE, required: true}
        ]),
        name: 'APPLICATION-QUERIES',
        displayName: 'APPLICATION-QUERIES',
        env,
        updatedBy: userId,
        description: 'this model consist of queries',
        createdAt,
        createdBy: userId,
        updatedAt: createdAt,
        titleField: 'title'
    });

    await newCollection.save();
}

export class EventOnEnvCreate extends EventEmitter {

    eventData: OnEnvCreate;

    constructor(props: OnEnvCreate) {
        super();
        this.eventData = props;
    }

    exec() {
        DataEventInstance.emit(EVENT_TYPE_ENV_CREATED, this.eventData);
    }
}