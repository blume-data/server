import request from 'supertest';
import { app } from '../../app';
import {emailVerificationUrl, signUp} from "../../util/urls";

const sampleData = {
    "email": "t@t.com",
    "password": "sddsdf",
    "firstName": "Taranjeet",
    "lastName": "Singh",
    "userName": "taranjeet"
};

it('Client : Email verification', async (done) => {
    const response = await request(app)
        .post(signUp)
        .send(sampleData)
        .expect(201);

    await request(app)
        .get(emailVerificationUrl)
        .send({})
        .expect(400);

    await request(app)
        .get(`${emailVerificationUrl}?email=${response.body.email}&token=${response.body.verificationToken}`)
        .expect(201);


    await request(app)
        .get(`${emailVerificationUrl}?email=${response.body.email}&token=4324sdfssdf`)
        .expect(400);

    done();
});