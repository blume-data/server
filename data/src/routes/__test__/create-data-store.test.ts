import {errorStatus, okayStatus, rootUrl, USER_COLLECTION} from "../../util/constants";
import request from "supertest";
import {app} from "../../app";


const collectionUrl = `${rootUrl}/en/sampleUserName/collection`;
const storeUrl = `${rootUrl}/en/sampleUserName/collection/sampleName`;

const sampleData = {
    "name": "sampleName",
    "rules": [
        {
            "name": "lastName",
            "default":"defaultName",
            "type": "string",
            "unique": true
        },
        {
            "name": "today",
            "type": "date"
        }]
};

const sampleStoreData = {
    "today":"30/09/2020 11:43:43",
    "lastName":"dfd"
};

describe('Çreate Data in Collection:Store', () => {

    it('Store:Unique - Returns error when duplicate name in rules', async () => {
        await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(okayStatus);

        /*const response =*/ await request(app)
            .post(storeUrl)
            .send(sampleStoreData)
            .expect(okayStatus);

        const response = await request(app)
            .post(storeUrl)
            .send(sampleStoreData)
            .expect(errorStatus);

        console.log('response', response.body);

        /*

        expect(response.body.errors[0].message).toEqual('hello is already present in rules');
        expect(response.body.errors[0].field).toEqual('rules');*/
    });

    /*it('Data Store: It create the data in a collection', async () => {
        const se = await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(okayStatus);

        const response = await request(app)
            .post(storeUrl)
            .send(sampleStoreData)
            .expect(errorStatus);

        expect(response.body.errors).toEqual([ { field: 'email', message: 'email is required' },
            { field: 'password', message: 'password is required' } ]);
    });*/

});
