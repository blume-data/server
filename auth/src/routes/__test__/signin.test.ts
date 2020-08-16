import request from 'supertest';
import { app } from '../../app';
import {emailVerification, register, signInUrl} from "../../util/urls";
import {AUTH_TOKEN, errorStatus, okayStatus} from "@ranjodhbirkaur/common";
import {rootUrl} from "../../util/constants";
import {clientUserType} from "../../middleware/userTypeCheck";
import {InvalidLoginCredentialsMessage} from "../../util/errorMessages";

const sampleData = {
    "email": "t@t.com",
    "password": "some-password",
    "firstName": "some-first-name",
    "lastName": "some-last-name",
    "userName": "some-user-name"
};

async function beforeEach() {
    const registrationUrl = `${rootUrl}/${clientUserType}/${register}`;
    const emailVerificationUrl = `${rootUrl}/${clientUserType}/${emailVerification}`;

    const user = await request(app)
        .post(registrationUrl)
        .send(sampleData)
        .expect(okayStatus);

    await request(app)
        .get(`${emailVerificationUrl}?email=${sampleData.email}&token=${user.body.verificationToken}`)
        .expect(okayStatus);
}

describe('Logs in the client user', () => {
    it('fails when a email/password that does not exist is supplied', async () => {

        await request(app)
            .post(signInUrl)
            .send({})
            .expect(errorStatus);
    });

    it('SignIn: verification and sign in', async () => {

        await beforeEach();
        const response = await request(app)
            .post(signInUrl)
            .send({
                email: sampleData.email,
                password: sampleData.password
            })
            .expect(okayStatus);

        expect(response.body.email).toBe(sampleData.email);
        expect(response.body.userName).toBe(sampleData.userName);
        expect(response.body[AUTH_TOKEN]).toBeDefined();
        expect(response.body.id).toBeDefined();
    });

    it('SignIn: verification fails when wrong password provided', async () => {

        await beforeEach();
        const response = await request(app)
            .post(signInUrl)
            .send({
                email: sampleData.email,
                password: 'some-wrong-password'
            })
            .expect(errorStatus);

        expect(response.body.errors[0].message).toBe(InvalidLoginCredentialsMessage);
    });

    it('responds with a cookie when given valid credentials', async () => {

        await beforeEach();
        const response = await request(app)
            .post(signInUrl)
            .send({
                email: sampleData.email,
                password: sampleData.password
            })
            .expect(okayStatus);

        expect(response.get('Set-Cookie')).toBeDefined();
    });
});
