import {errorStatus, okayStatus, serviceName} from "../../../util/constants";
import request from "supertest";
import {app} from "../../../app";
import {RANDOM_STRING} from "../../../util/methods";
import {PRODUCTION_ENV} from "../../../util/enviornmentTypes";

const sampleUserName = RANDOM_STRING();
const sampleCollectionName = RANDOM_STRING();
const collectionUrl = `${serviceName}/${PRODUCTION_ENV}/en/${sampleUserName}/collection`;
const storeUrl = `${serviceName}/{${PRODUCTION_ENV}/en/${sampleUserName}/collection/${sampleCollectionName}`;

const sampleData = {
    "name": sampleCollectionName,
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

        await request(app)
            .post(storeUrl)
            .send(sampleStoreData)
            .expect(okayStatus);

        const response = await request(app)
            .post(storeUrl)
            .send(sampleStoreData)
            .expect(errorStatus);

        expect(response.body.errors[0].message).toEqual('lastName should be unique. Value dfd already exist.');
        expect(response.body.errors[0].field).toEqual('lastName');
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
