import request from 'supertest';
import {app} from '../../app';
import {errorStatus, okayStatus, clientUserType, adminUserType} from "@ranjodhbirkaur/common";
import {passwordLimitOptionErrorMessage, stringLimitOptionErrorMessage} from "../../util/constants";
import {EmailInUseMessage, InValidEmailMessage, UserNameNotAvailableMessage} from "../../util/errorMessages";
import {getEmailVerificationUrl, getRegistrationUrl, SampleDataType} from "../../test/setup";

let sampleData: SampleDataType = {
    "email": "t@t.com",
    "password": "some-password",
    "firstName": "some-first-name",
    "lastName": "some-last-name",
    "userName": "some-user-name"
};

function getSampleData(userType: string) {
    let sampleData: SampleDataType = {
        "email": "t@t.com",
        "password": "some-password",
        "firstName": "some-first-name",
        "lastName": "some-last-name",
        "userName": "some-user-name"
    };
    if (userType === adminUserType) {
        sampleData = {
            ...sampleData,
            adminType: adminUserType
        }
    }
    return sampleData;
}

async function beforeEach(userType: string) {

    const registrationUrl = getRegistrationUrl(userType);
    const emailVerificationUrl = getEmailVerificationUrl(userType);

    const user = await request(app)
        .post(registrationUrl)
        .send(getSampleData(userType))
        .expect(okayStatus);

    await request(app)
        .get(`${emailVerificationUrl}?email=${sampleData.email}&token=${user.body.verificationToken}`)
        .expect(okayStatus);
}

async function registerUser(userType: string, sampleData?: object) {
    const registrationUrl = getRegistrationUrl(userType);
    const data = sampleData ? sampleData : getSampleData(userType);
    return request(app)
        .post(registrationUrl)
        .send(data);
}

async function testSignUp(userType: string) {
    const response = await registerUser(userType);
    expect(response.status).toBe(okayStatus);
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe(sampleData.email);
    expect(response.body.userName).toBe(sampleData.userName);
}

async function registerWithInvalidEmail(userType: string) {
    let data = getSampleData(userType);
    data = {
        ...data,
        email: ''
    };
    const response = await registerUser(userType, data);
    expect(response.status).toBe(errorStatus);
    expect(response.body.errors[0].message).toBe(InValidEmailMessage);
    expect(response.body.errors[0].field).toBe('email');
}

async function registerWithInvalidPassword(userType: string) {
    let data = getSampleData(userType);
    data = {
        ...data,
        password: ''
    };
    const response = await registerUser(userType, data);
    expect(response.status).toBe(errorStatus);
    expect(response.body.errors[0].message).toBe(passwordLimitOptionErrorMessage('password'));
    expect(response.body.errors[0].field).toBe('password');
}

async function registerWithInvalidUserName(userType: string) {

    let data = getSampleData(userType);
    data = {
        ...data,
        userName: ''
    };
    const response = await registerUser(userType, data);
    expect(response.status).toBe(errorStatus);
    expect(response.body.errors[0].message).toBe(stringLimitOptionErrorMessage('userName'));
    expect(response.body.errors[0].field).toBe('userName');
}

async function allowsDuplicateEmails(userType: string) {
    await testSignUp(userType);
    await testSignUp(userType);
}

async function doesNotAllowsDuplicateUserName(userType: string) {
    await beforeEach(userType);
    let data = {
        ...sampleData,
        email: 'somedsfds@gmail.com'
    };
    const response = await registerUser(clientUserType, data);
    expect(response.status).toBe(errorStatus);
    expect(response.body.errors[0].message).toBe(UserNameNotAvailableMessage);
    expect(response.body.errors[0].field).toBe('userName');
}

describe('registers the client user', () => {

    it('returns a okay on successful sign-up', async () => {
        await testSignUp(clientUserType);
    });

    it('returns a 400 with an invalid email', async () => {
        await registerWithInvalidEmail(clientUserType);
    });

    it('returns a 400 with an invalid password', async () => {
        await registerWithInvalidPassword(clientUserType);
    });

    it('returns a 400 with an invalid username', async () => {
        await registerWithInvalidUserName(clientUserType);
    });

    it('allows duplicate emails in temp emails', async () => {
        await allowsDuplicateEmails(clientUserType);
    });

    it('Disallows verified users to sign up', async () => {
        await beforeEach(clientUserType);
        const response = await registerUser(clientUserType);
        expect(response.status).toBe(errorStatus);
        expect(response.body.errors[0].message).toBe(EmailInUseMessage);
        expect(response.body.errors[0].field).toBe('email');
    });

    it('Does not allows duplicate userName', async () => {
        await doesNotAllowsDuplicateUserName(clientUserType);
    });
});

describe('registers the admin user', () => {

    it('returns a okay on successful sign-up', async () => {
        await testSignUp(adminUserType);
    });

    it('returns a 400 with an invalid email', async () => {
        await registerWithInvalidEmail(adminUserType)
    });

    it('returns a 400 with an invalid password', async () => {
        await registerWithInvalidPassword(adminUserType);
    });

    it('returns a 400 with an invalid username', async () => {
        await registerWithInvalidUserName(adminUserType);
    });

    it('Does not allows duplicate emails', async () => {
        await testSignUp(adminUserType);

        const response = await registerUser(adminUserType);
        expect(response.status).toBe(errorStatus);
        expect(response.body.errors[0].message).toBe(EmailInUseMessage);
        expect(response.body.errors[0].field).toBe('email');
    });
});
