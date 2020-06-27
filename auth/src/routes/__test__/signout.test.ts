import request from 'supertest';
import { app } from '../../app';
import {emailVerificationUrl, signIn, signOutUrl, signUp} from "../../util/urls";
import {okayStatus} from "../../util/constants";

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

it('clears the cookie after signing out', async () => {

    await beforeEach();

    await request(app)
        .post(signIn)
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
