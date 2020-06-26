import request from 'supertest';
import { app } from '../../app';
import {signUp} from "../../util/urls";

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
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post(signUp)
    .send({
        ...sampleData, email: ''
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post(signUp)
    .send({
      ...sampleData, password: ''
    })
    .expect(400);
});

it('returns a 400 with an invalid username', async () => {
    return request(app)
        .post(signUp)
        .send({
            ...sampleData, userName: ''
        })
        .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post(signUp)
    .send({
      ...sampleData, email: undefined
    })
    .expect(400);

  await request(app)
    .post(signUp)
    .send({
      ...sampleData, password: undefined
    })
    .expect(400);
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
    .expect(400);
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
