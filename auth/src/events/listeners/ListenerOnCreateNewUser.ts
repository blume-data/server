import {EXAMPLE_APPLICATION_NAME} from "../../util/constants";
import {PRODUCTION_ENV} from "@ranjodhbirkaur/constants";
import {DateTime} from "luxon";
import {ApplicationSpaceModel} from "../../models/ApplicationSpace";

export async function ListenerOnCreateNewUser(userId: string) {
    const createdAt = DateTime.local().setZone('UTC').toJSDate();

    const newApplicationSpace = ApplicationSpaceModel.build({
        clientUserId: userId,
        name: EXAMPLE_APPLICATION_NAME,
        env: [PRODUCTION_ENV],
        updatedBy: userId,
        description: 'This is an example space',

        createdAt,
        createdBy: userId,
        updatedAt: createdAt
    });

    await newApplicationSpace.save();
}