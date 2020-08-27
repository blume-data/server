import request from 'supertest';
import { app } from '../../app';
import {emailVerification, logIn, logOut, register} from "../../util/urls";
import {okayStatus, clientUserType} from "@ranjodhbirkaur/common";
import {rootUrl} from "../../util/constants";

const sampleData = {
    "email": "t@t.com",
    "password": "sddsdf",
    "firstName": "Taranjeet",
    "lastName": "Singh",
    "userName": "taranjeet"
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

describe('Logs out the client user', () => {
    it('clears the cookie after signing out', async () => {

        await beforeEach();
        const signInUrl = `${rootUrl}/${clientUserType}/${logIn}`;
        const signOutUrl = `${rootUrl}/${clientUserType}/${logOut}`;

        await request(app)
            .post(signInUrl)
            .send({
                email: sampleData.email,
                password: sampleData.password
            })
            .expect(okayStatus);

        const response = await request(app)
            .post(signOutUrl)
            .send({})
            .expect(okayStatus);

        expect(response.get('Set-Cookie')[0]).toEqual(
            'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
        );
    });
});
