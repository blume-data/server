import request from 'supertest';
import { app } from '../../app';
import {currentUserUrl} from "../../util/urls";
import {errorStatus, okayStatus} from "../../util/constants";

it('responds with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get(currentUserUrl)
    .set('Cookie', cookie)
    .send()
    .expect(okayStatus);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get(currentUserUrl)
    .send()
    .expect(errorStatus);

  expect(response.body.currentUser).toEqual(null);
});

