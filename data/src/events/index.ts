import {EventEmitter} from 'events';
import {EVENT_TYPE_ENV_CREATED, onEnvCreate} from "./OnEnvCreate";

export const DataEventInstance = new EventEmitter();

// events
DataEventInstance.on(EVENT_TYPE_ENV_CREATED, onEnvCreate);



