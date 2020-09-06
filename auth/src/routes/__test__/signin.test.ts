import request from 'supertest';
import {app} from '../../app';
import {AUTH_TOKEN, okayStatus, clientUserType, adminUserType, adminType} from "@ranjodhbirkaur/common";
import {InValidEmailMessage, InvalidLoginCredentialsMessage} from "../../util/errorMessages";
import {getSampleData, signUpAUser} from "../../test/testHelpers";
import {getSignInUrl} from "../../test/setup";
import {passwordLimitOptionErrorMessage} from "../../util/constants";

async function loginUser(userType: string, sampleData?: object) {
    const signInUrl = getSignInUrl(userType);
    const data = sampleData ? sampleData : getSampleData(userType);
    await signUpAUser(userType);

    return request(app)
        .post(signInUrl)
        .send(data);
}

async function testUserLogin(userType: string) {
    const data = getSampleData(userType);
    const response = await loginUser(userType);
    expect(response.status).toBe(okayStatus);
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe(data.email);
    expect(response.body.userName).toBe(data.userName);
    if (userType === adminUserType) {
        expect(response.body[AUTH_TOKEN]).toBeDefined();
    }
}

async function testUserLoginWithInValidCredentials(userType: string) {
    const inValidData = {someThingInvalid: 'invalid', [adminType]: adminUserType};
    const response = await loginUser(userType, inValidData);
    if (userType === clientUserType || userType === adminUserType) {
        expect(response.body.errors[0].message).toBe(InValidEmailMessage);
        expect(response.body.errors[0].field).toBe('email');

        expect(response.body.errors[1].message).toBe(passwordLimitOptionErrorMessage('password'));
        expect(response.body.errors[1].field).toBe('password');
    }
}

async function testUserLoginFailsWIthInvalidPassword(userType: string) {
    const sampleData = getSampleData(userType);
    const response = await loginUser(userType, {
        ...sampleData,
        password: 'some-wrong-password'
    });

    expect(response.body.errors[0].message).toBe(InvalidLoginCredentialsMessage);
}

async function testUserLoginReturnsCookie(userType: string) {
    const response = await loginUser(userType);
    expect(response.get('Set-Cookie')).toBeDefined();
}

describe('Logs in the client user', () => {

    describe('Logs in a valid user',() => {
        it('ClientUser', async () => {
            await testUserLogin(clientUserType);
        });
        it('AdminUser', async () => {
            await testUserLogin(adminUserType);
        });

    });

    describe('fails when a email/password that does not exist is supplied',() => {
        it('clientUser', async () => {
            await testUserLoginWithInValidCredentials(clientUserType);
        });
        it('adminUser', async () => {
            await testUserLoginWithInValidCredentials(adminUserType);
        })
    });

    describe('SignIn: verification fails when wrong password provided',() => {
        it('ClientUser', async () => {
            await testUserLoginFailsWIthInvalidPassword(clientUserType);
        });
        it('AdminUser', async () => {
            await testUserLoginFailsWIthInvalidPassword(adminUserType);
        });
    });

    describe('responds with a cookie when given valid credentials',() => {
        it('client user', async () => {
            await testUserLoginReturnsCookie(clientUserType);
        });
    });
});
