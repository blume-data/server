import {EventEmitter} from "events";
import {AuthEventInstance} from "./index";

export const EVENT_TYPE_ON_CREATE_NEW_USER = 'EVENT_TYPE_ON_CREATE_NEW_USER';
export interface OnCreateNewUser {
    applicationName: string;
    description: string;
    userId: string;
}

// on create a new use create an example application space
export class OnCreateNewUser extends EventEmitter {

    eventData: OnCreateNewUser;

    constructor(props: OnCreateNewUser) {
        super();
        this.eventData = props;
    }

    exec() {
        AuthEventInstance.emit(EVENT_TYPE_ON_CREATE_NEW_USER, this.eventData);
    }

}