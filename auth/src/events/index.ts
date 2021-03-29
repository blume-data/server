import {EventEmitter} from 'events';
import {EVENT_TYPE_ON_CREATE_NEW_USER} from "./OnCreateNewUser";
import {ListenerOnCreateNewUser} from "./listeners";

export const AuthEventInstance = new EventEmitter();

AuthEventInstance.on(EVENT_TYPE_ON_CREATE_NEW_USER, ListenerOnCreateNewUser)