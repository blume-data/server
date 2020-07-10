import {errorStatus, okayStatus, rootUrl} from "../../util/constants";
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
            "required": true,
            "type": "string"
        },
        {
            "name": "age",
            "type": "number",
            "required": true
        },
        {
            "name": "today",
            "type": "date"
        }]
};

const sampleStoreData = {
    "age": 28,
    "lastName": "singh",
    "today":"30/09/2020 11:43:43"
};

describe('Çreate Data in Collection', () => {

    it('Data Store: It create the data in a collection', async () => {
        await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(okayStatus);

        /*const response = await request(app)
            .post(storeUrl)
            .send(sampleStoreData)
            .expect(errorStatus);

        console.log('response', response.body);
        expect(response.body.age).toEqual(28);*/
    });
});
