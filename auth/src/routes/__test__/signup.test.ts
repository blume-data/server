import request from 'supertest';
import { app } from '../../app';
import {emailVerificationUrl, signUp} from "../../util/urls";
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

it('returns a okay on successful signup', async () => {
  return request(app)
    .post(signUp)
    .send(sampleData)
    .expect(okayStatus);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post(signUp)
    .send({
        ...sampleData, email: ''
    })
    .expect(errorStatus);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post(signUp)
    .send({
      ...sampleData, password: ''
    })
    .expect(errorStatus);
});

it('returns a 400 with an invalid username', async () => {
    return request(app)
        .post(signUp)
        .send({
            ...sampleData, userName: ''
        })
        .expect(errorStatus);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post(signUp)
    .send({
      ...sampleData, email: undefined
    })
    .expect(errorStatus);

  await request(app)
    .post(signUp)
    .send({
      ...sampleData, password: undefined
    })
    .expect(errorStatus);
});

it('allows duplicate emails in temp emails', async () => {
  await request(app)
    .post(signUp)
    .send({
      ...sampleData
    })
    .expect(okayStatus);

  await request(app)
    .post(signUp)
    .send({
      ...sampleData
    })
    .expect(errorStatus);
});

it('Disallows verified users to signup', async () => {

    await beforeEach();
    await request(app)
        .post(signUp)
        .send({
            ...sampleData
        })
        .expect(errorStatus);
});
