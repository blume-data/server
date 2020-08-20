import request from 'supertest';
import { app } from '../../app';
import {currentUser, currentUserUrl, register} from "../../util/urls";
import {errorStatus, okayStatus} from "@ranjodhbirkaur/common";
import {clientUserType} from "../../middleware/userTypeCheck";
import {rootUrl} from "../../util/constants";

describe('It returns cookie for authenticated user', () => {
  const currentUserUrl = `${rootUrl}/${clientUserType}/${currentUser}`;

  it('responds with details about the current user', async () => {

    const cookie = await global.signIn(clientUserType, {email: `test@taranjeet.com`});

    const response = await request(app)
        .get(currentUserUrl)
        .set('Cookie', cookie)
        .send()
        .expect(okayStatus);

    expect(response.body.currentUser.email).toEqual('test@taranjeet.com');
  });

  it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get(currentUserUrl)
        .send()
        .expect(errorStatus);

    expect(response.body.currentUser).toEqual(undefined);
  });
});

