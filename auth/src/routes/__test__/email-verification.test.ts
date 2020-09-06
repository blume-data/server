import request from 'supertest';
import { app } from '../../app';
import {errorStatus, clientUserType} from "@ranjodhbirkaur/common";
import {getEmailVerificationUrl} from "../../test/setup";
import {getSampleData} from "../../test/testHelpers";
import {registerUser} from "./signup.test";
import {TOKEN_NOT_VALID} from "../../util/errorMessages";

async function verifyEmailOfUser(userType: string) {
    const data = getSampleData(userType);
    await registerUser(userType);

    const response = await request(app)
        .get(`${getEmailVerificationUrl(userType)}?email=${data.email}&token=sdffdsf`)
        .expect(errorStatus);

    expect(response.body.errors[0].message).toBe(TOKEN_NOT_VALID);
}

describe('Test Email Verification', () => {
    describe('Email gets verified of client user', () => {

        it('ClientUser', async () => {
            await global.signUp(clientUserType);
        });
    });

    describe('Returns Error on invalid email token', () => {
        it('ClientUser', async () => {
            await verifyEmailOfUser(clientUserType);
        });
    })
});