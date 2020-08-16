import request from 'supertest';
import { app } from '../../app';
import {emailVerification, register, signUpUrl} from "../../util/urls";
import {errorStatus, okayStatus} from "@ranjodhbirkaur/common";
import {rootUrl} from "../../util/constants";
import {clientUserType} from "../../middleware/userTypeCheck";

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
        return request(app)
            .post(registrationUrl)
            .send(sampleData)
            .expect(okayStatus);
    });

    it('returns a 400 with an invalid email', async () => {
        return request(app)
            .post(registrationUrl)
            .send({
                ...sampleData, email: ''
            })
            .expect(errorStatus);
    });

    it('returns a 400 with an invalid password', async () => {
        return request(app)
            .post(registrationUrl)
            .send({
                ...sampleData, password: ''
            })
            .expect(errorStatus);
    });

    it('returns a 400 with an invalid username', async () => {
        return request(app)
            .post(registrationUrl)
            .send({
                ...sampleData, userName: ''
            })
            .expect(errorStatus);
    });

    it('returns a 400 with missing email and password', async () => {
        await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData, email: undefined
            })
            .expect(errorStatus);

        await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData, password: undefined
            })
            .expect(errorStatus);
    });

    it('allows duplicate emails in temp emails', async () => {
        await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData
            })
            .expect(okayStatus);

        await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData
            })
            .expect(okayStatus);
    });

    it('Disallows verified users to signup', async () => {

        await beforeEach();
        await request(app)
            .post(registrationUrl)
            .send({
                ...sampleData
            })
            .expect(errorStatus);
    });
});
