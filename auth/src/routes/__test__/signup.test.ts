import request from 'supertest';
import { app } from '../../app';
import {emailVerification, register} from "../../util/urls";
import {errorStatus, okayStatus} from "@ranjodhbirkaur/common";
import {passwordLimitOptionErrorMessage, rootUrl, stringLimitOptionErrorMessage} from "../../util/constants";
import {clientUserType} from "../../middleware/userTypeCheck";
import {EmailInUseMessage, InValidEmailMessage} from "../../util/errorMessages";

const sampleData = {
    "email": "t@t.com",
    "password": "some-password",
    "firstName": "some-first-name",
    "lastName": "some-last-name",
    "userName": "some-user-name"
};

const registrationUrl = `${rootUrl}/${clientUserType}/${register}`;
const emailVerificationUrl = `${rootUrl}/${clientUserType}/${emailVerification}`;

async function beforeEach() {
    const user = await request(app)
        .post(registrationUrl)
        .send(sampleData)
        .expect(okayStatus);

    await request(app)
        .get(`${emailVerificationUrl}?email=${sampleData.email}&token=${user.body.verificationToken}`)
        .expect(okayStatus);
}

describe('register client user', () => {

    it('returns a okay on successful sign-up', async () => {
        const response = await request(app)
            .post(registrationUrl)
            .send(sampleData)
            .expect(okayStatus);

        expect(response.body.id).toBeDefined();
        expect(response.body.email).toBe(sampleData.email);
        expect(response.body.userName).toBe(sampleData.userName);
    });

    it('returns a 400 with an invalid email', async () => {
        const response = await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData, email: ''
            })
            .expect(errorStatus);
        expect(response.body.errors[0].message).toBe(InValidEmailMessage);
        expect(response.body.errors[0].field).toBe('email');
    });

    it('returns a 400 with an invalid password', async () => {
        const response = await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData, password: ''
            })
            .expect(errorStatus);

        expect(response.body.errors[0].message).toBe(passwordLimitOptionErrorMessage('password'));
        expect(response.body.errors[0].field).toBe('password');

    });

    it('returns a 400 with an invalid username', async () => {
        const response = await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData, userName: ''
            })
            .expect(errorStatus);

        expect(response.body.errors[0].message).toBe(stringLimitOptionErrorMessage('userName'));
        expect(response.body.errors[0].field).toBe('userName');
    });

    it('returns a 400 with missing email and password', async () => {
        let response = await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData, email: undefined
            })
            .expect(errorStatus);

        expect(response.body.errors[0].message).toBe(InValidEmailMessage);
        expect(response.body.errors[0].field).toBe('email');

        response = await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData, password: undefined
            })
            .expect(errorStatus);

        expect(response.body.errors[0].message).toBe('password must be present');
        expect(response.body.errors[0].field).toBe('password');
    });

    it('allows duplicate emails in temp emails', async () => {
        let response = await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData
            })
            .expect(okayStatus);

        expect(response.body.id).toBeDefined();
        expect(response.body.email).toBe(sampleData.email);
        expect(response.body.userName).toBe(sampleData.userName);

        response = await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData
            })
            .expect(okayStatus);

        expect(response.body.id).toBeDefined();
        expect(response.body.email).toBe(sampleData.email);
        expect(response.body.userName).toBe(sampleData.userName);
    });

    it('Disallows verified users to sign up', async () => {

        await beforeEach();
        const response = await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData
            })
            .expect(errorStatus);
        expect(response.body.errors[0].message).toBe(EmailInUseMessage);
        expect(response.body.errors[0].field).toBe('email');
    });
});
