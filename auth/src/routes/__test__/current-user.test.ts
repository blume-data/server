import request from 'supertest';
import { app } from '../../app';
import {currentUser} from "../../util/urls";
import {errorStatus, okayStatus, clientUserType} from "@ranjodhbirkaur/common";
import {rootUrl} from "../../util/constants";

describe('ClientUser: It returns cookie for authenticated user', () => {
  const currentUserUrl = `${rootUrl}/${clientUserType}/${currentUser}`;

  it('responds with details about the current user', async () => {

    const email = 'test@taranjeet.com';

    const {cookie} = await global.signUp(clientUserType, {email});

    const response = await request(app)
        .get(currentUserUrl)
        .set('Cookie', cookie)
        .send()
        .expect(okayStatus);

    expect(response.body.currentUser.email).toEqual(email);
  });

  it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get(currentUserUrl)
        .send()
        .expect(errorStatus);

    expect(response.body.currentUser).toEqual(undefined);
  });
});

