import request from 'supertest';
import {app} from '../../app';
import {errorStatus, okayStatus, clientUserType, adminUserType} from "@ranjodhbirkaur/common";
import {getUserNameValidationUrl} from "../../test/setup";
import {getSampleData, signUpAUser} from "../../test/testHelpers";
import {USER_NAME_NOT_AVAILABLE} from "../../util/errorMessages";

async function testUserName(userType: string, userName: string) {
    const userNameValidationUrl = getUserNameValidationUrl(userType);
    return request(app)
        .post(userNameValidationUrl)
        .send({userName});
}

describe('It validates username of client', () => {
    describe('returns true if username is available', () => {
       it('Client user', async () => {
           const response = await testUserName(clientUserType, 'some-available');
           expect(response.status).toBe(okayStatus);
           expect(response.body).toBe(true);
       });
        it('Admin user', async () => {
            const response = await testUserName(adminUserType, 'some-available');
            expect(response.status).toBe(okayStatus);
            expect(response.body).toBe(true);
        });
    });

    describe('Returns error if the username is not available', () => {
        it('Client User', async () => {
            const sampleData = getSampleData(clientUserType);
            await signUpAUser(clientUserType);
            const response = await testUserName(clientUserType, sampleData.userName);
            expect(response.status).toBe(errorStatus);
            expect(response.body.errors[0].message).toBe(USER_NAME_NOT_AVAILABLE);
        });

        it('Admin User', async () => {
            const sampleData = getSampleData(adminUserType);
            await signUpAUser(adminUserType);
            const response = await testUserName(adminUserType, sampleData.userName);
            expect(response.status).toBe(errorStatus);
            expect(response.body.errors[0].message).toBe(USER_NAME_NOT_AVAILABLE);
        });
    });
});