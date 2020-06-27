import request from 'supertest';
import { app } from '../../app';
import {signUp} from "../../util/urls";
import {errorStatus, okayStatus} from "../../util/constants";

const sampleData = {
    "email": "t@t.com",
    "password": "sddsdf",
    "firstName": "Taranjeet",
    "lastName": "Singh",
    "userName": "taranjeet"
};

it('returns a 201 on successful signup', async () => {
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

it('disallows duplicate emails', async () => {
  await request(app)
    .post(signUp)
    .send({
      ...sampleData
    })
    .expect(201);

  await request(app)
    .post(signUp)
    .send({
      ...sampleData
    })
    .expect(errorStatus);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post(signUp)
    .send({
      ...sampleData
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
