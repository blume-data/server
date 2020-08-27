import request from 'supertest';
import { app } from '../../app';
import {emailVerification, register} from "../../util/urls";
import {errorStatus, okayStatus, clientUserType} from "@ranjodhbirkaur/common";
import {rootUrl} from "../../util/constants";

const sampleData = {
    "email": "t@t.com",
    "password": "sddsdf",
    "firstName": "Taranjeet",
    "lastName": "Singh",
    "userName": "taranjeet"
};

describe('Email gets verified of client user', () => {
    const registrationUrl = `${rootUrl}/${clientUserType}/${register}`;
    const emailVerificationUrl = `${rootUrl}/${clientUserType}/${emailVerification}`;

    it('Client : Email verification', async (done) => {
        const response = await request(app)
            .post(registrationUrl)
            .send(sampleData)
            .expect(okayStatus);

        await request(app)
            .get(emailVerificationUrl)
            .send({})
            .expect(errorStatus);

        await request(app)
            .get(`${emailVerificationUrl}?email=${response.body.email}&token=${response.body.verificationToken}`)
            .expect(okayStatus);


        await request(app)
            .get(`${emailVerificationUrl}?email=${response.body.email}&token=4324sdfssdf`)
            .expect(errorStatus);

        done();
    });
});