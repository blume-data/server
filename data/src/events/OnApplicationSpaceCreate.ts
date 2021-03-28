import {EventEmitter} from "events";
import {DataEventInstance} from "./index";

export const EVENT_TYPE_APPLICATION_SPACE_CREATED = 'EVENT_TYPE_APPLICATION_SPACE_CREATED';

export interface OnApplicationSpaceCreate {
    applicationName: string;
    description: string;
    userId: string;
}

export class EventOnApplicationSpaceCreate extends EventEmitter {

    eventData: OnApplicationSpaceCreate;

    constructor(props: OnApplicationSpaceCreate) {
        super();
        this.eventData = props;
    }

    exec() {
        DataEventInstance.emit(EVENT_TYPE_APPLICATION_SPACE_CREATED, this.eventData);
    }
}