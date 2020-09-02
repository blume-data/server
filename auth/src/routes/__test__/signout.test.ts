import request from 'supertest';
import { app } from '../../app';
import {okayStatus, clientUserType, adminUserType, logOut, authRootUrl} from "@ranjodhbirkaur/common";

async function signOutUser(userType: string) {
    const signOutUrl = `${authRootUrl}/${userType}/${logOut}`;
    await global.signUp(userType);

    const response = await request(app)
        .post(signOutUrl)
        .send({});

    expect(response.get('Set-Cookie')[0]).toEqual(
        'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
}

describe('Logs out the client user', () => {
    describe('Clears the cookie after signing out',() => {
        it('client User', async () => {
            await signOutUser(clientUserType);
        });

        it('Admin User', async () => {
            await signOutUser(adminUserType);
        });
    });
});
