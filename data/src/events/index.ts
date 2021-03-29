import {EventEmitter} from 'events';
import {EVENT_TYPE_ENV_CREATED, onEnvCreate} from "./OnEnvCreate";
import {EVENT_TYPE_APPLICATION_SPACE_CREATED, OnApplicationSpaceCreate} from "./OnApplicationSpaceCreate";
import {DateTime} from "luxon";
import {ApplicationSpaceModel} from "../models/ApplicationSpace";
import {PRODUCTION_ENV} from "@ranjodhbirkaur/constants";

export const DataEventInstance = new EventEmitter();

export async function onApplicationSpaceCreate(data: OnApplicationSpaceCreate) {

    const {applicationName, userId, description} = data;

    const createdAt = DateTime.local().setZone('UTC').toJSDate();

    const newApplicationSpace = ApplicationSpaceModel.build({
        clientUserId: userId,
        name: applicationName,
        env: [PRODUCTION_ENV],
        updatedBy: userId,
        description,

        createdAt,
        createdBy: userId,
        updatedAt: createdAt
    });

    await newApplicationSpace.save();
}

// events
DataEventInstance.on(EVENT_TYPE_ENV_CREATED, onEnvCreate);
DataEventInstance.on(EVENT_TYPE_APPLICATION_SPACE_CREATED, onApplicationSpaceCreate);



