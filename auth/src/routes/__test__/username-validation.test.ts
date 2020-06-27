import request from 'supertest';
import { app } from '../../app';
import {signUp, userNameValidationUrl} from "../../util/urls";

const sampleData = {
    "email": "t@t.com",
    "password": "sddsdf",
    "firstName": "Taranjeet",
    "lastName": "Singh",
    "userName": "taranjeet"
};

it('Client username validation', async (done) => {
    await request(app)
        .post(signUp)
        .send(sampleData)
        .expect(201);

    await request(app)
        .post(userNameValidationUrl)
        .send({})
        .expect(400);

    await request(app)
        .post(userNameValidationUrl)
        .send({userName: 'taranjeet'})
        .expect(400);


    await request(app)
        .post(userNameValidationUrl)
        .send({userName: 'sdfdsf'})
        .expect(200);

    done();
});