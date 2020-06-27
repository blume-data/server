import request from 'supertest';
import { app } from '../../app';
import {signUp, userNameValidationUrl} from "../../util/urls";
import {errorStatus, okayStatus} from "../../util/constants";

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
        .expect(okayStatus);

    await request(app)
        .post(userNameValidationUrl)
        .send({})
        .expect(errorStatus);

    await request(app)
        .post(userNameValidationUrl)
        .send({userName: 'taranjeet'})
        .expect(errorStatus);


    await request(app)
        .post(userNameValidationUrl)
        .send({userName: 'sdfdsf'})
        .expect(okayStatus);

    done();
});