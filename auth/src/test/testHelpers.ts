import {getEmailVerificationUrl, getRegistrationUrl, SampleDataType} from "./setup";
import {adminUserType, freeUserType, okayStatus} from "@ranjodhbirkaur/common";
import request from "supertest";
import {app} from "../app";

let sampleData: SampleDataType = {
    "email": "t@t.com",
    "password": "some-password",
    "firstName": "some-first-name",
    "lastName": "some-last-name",
    "userName": "some-user-name"
};

export function getSampleData(userType: string) {
    if (userType === adminUserType) {
        sampleData = {
            ...sampleData,
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