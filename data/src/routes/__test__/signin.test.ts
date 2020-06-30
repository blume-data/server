import request from 'supertest';
import { app } from '../../app';
import {emailVerificationUrl, signIn, signUp} from "../../util/urls";
import {errorStatus, okayStatus} from "../../util/constants";

const sampleData = {
    "email": "t@t.com",
    "password": "sddsdf",
    "firstName": "Taranjeet",
    "lastName": "Singh",
    "userName": "taranjeet"
};

async function beforeEach() {
    const user = await request(app)
        .post(signUp)
        .send(sampleData)
        .expect(okayStatus);

    await request(app)
        .get(`${emailVerificationUrl}?email=${sampleData.email}&token=${user.body.verificationToken}`)
        .expect(okayStatus);
}

it('fails when a email/password that does not exist is supplied', async () => {

  await request(app)
    .post(signIn)
    .send({})
    .expect(errorStatus);
});

it('SignIn: verification and signin', async () => {

    await beforeEach();
    await request(app)
        .post(signIn)
        .send({
            email: sampleData.email,
            password: sampleData.password
        })
        .expect(okayStatus);
});

it('SignIn: verification fails when wrong password provided', async () => {

    await beforeEach();
    await request(app)
        .post(signIn)
        .send({
            email: sampleData.email,
            password: 'some-wrong-password'
        })
        .expect(errorStatus);
});

it('responds with a cookie when given valid credentials', async () => {

    await beforeEach();
    const response = await request(app)
        .post(signIn)
        .send({
            email: sampleData.email,
            password: sampleData.password
        })
        .expect(okayStatus);

    expect(response.get('Set-Cookie')).toBeDefined();
});
