import {getEmailVerificationUrl, getRegistrationUrl, SampleDataType} from "./setup";
import {adminType, adminUserType, APPLICATION_NAME, clientUserType, CLIENT_USER_NAME, EMAIL, FIRST_NAME, freeUserType, LAST_NAME, okayStatus, PASSWORD, superVisorUserType, USER_NAME} from "@ranjodhbirkaur/common";
import request from "supertest";
import {app} from "../app";
import { supportUserType } from "@ranjodhbirkaur/constants";

let sampleData: SampleDataType = {
    [USER_NAME]: "some_unique_user_name",
    [PASSWORD]: "some-password",
    
};

export function getSampleData(userType: string) {

    switch(userType) {
        case adminUserType: {
            sampleData = {
                ...sampleData,
                [EMAIL]: 'taranjeet@admin.com',
                [adminType]: adminType
            }
            break;
        }
        case clientUserType: {
            sampleData = {
                ...sampleData,
                [FIRST_NAME]: 'taranjeet',
                [LAST_NAME]: 'singh',
            }
            break;
        }
        case superVisorUserType: {
            sampleData = {
                ...sampleData,
                [CLIENT_USER_NAME]: '',
                [APPLICATION_NAME]: ''
            }
            break;
        }
        case supportUserType: {
            sampleData = {
                ...sampleData,
                [CLIENT_USER_NAME]: '',
                [APPLICATION_NAME]: ''
            }
            break;
        }
    }

    if (userType === adminUserType) {
        sampleData = {
            ...sampleData,
            [EMAIL]: 'taranjeet@admin.com',
            adminType: adminUserType
        }
    }
    if (userType === freeUserType) {
        sampleData = {
            ...sampleData,

        }
    }
    return sampleData;
}

export async function signUpAUser(userType: string) {

    const registrationUrl = getRegistrationUrl(userType);
    const emailVerificationUrl = getEmailVerificationUrl(userType);

    const user = await request(app)
        .post(registrationUrl)
        .send(getSampleData(userType))
        .expect(okayStatus);

    if (userType !== adminUserType) {
        await request(app)
            .get(`${emailVerificationUrl}?email=${sampleData.email}&token=${user.body.verificationToken}`)
            .expect(okayStatus);
    }
}