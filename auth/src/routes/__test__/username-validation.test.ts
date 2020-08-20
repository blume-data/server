import request from 'supertest';
import { app } from '../../app';
import {register, userNameValidationUrl} from "../../util/urls";
import {errorStatus, okayStatus} from "@ranjodhbirkaur/common";
import {rootUrl} from "../../util/constants";
import {clientUserType} from "../../middleware/userTypeCheck";

const sampleData = {
    "email": "t@t.com",
    "password": "sddsdf",
    "firstName": "Taranjeet",
    "lastName": "Singh",
    "userName": "taranjeet"
};

describe('it validates username of client', () => {

    const registrationUrl = `${rootUrl}/${clientUserType}/${register}`;

    it('Client username validation', async (done) => {
        await request(app)
            .post(registrationUrl)
            .send(sampleData)
            .expect(okayStatus);

        await request(app)
            .post(userNameValidationUrl)
            .send({})
            .expect(errorStatus);

        const userData = await global.signUp(clientUserType, {userName: 'some-user-name'});

        await request(app)
            .post(userNameValidationUrl)
            .send({userName: userData.userName})
            .expect(errorStatus);

        await request(app)
            .post(userNameValidationUrl)
            .send({userName: 'sdfdsfdfdg354sfdsfds324324'})
            .expect(okayStatus);

        done();
    });
});