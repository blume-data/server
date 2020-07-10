import {errorStatus, okayStatus, rootUrl, USER_COLLECTION} from "../../util/constants";
import request from "supertest";
import {app} from "../../app";


const collectionUrl = `${rootUrl}/en/sampleUserName/collection`;
const storeUrl = `${rootUrl}/en/sampleUserName/collection/sampleName`;

const sampleData = {
    "name": "sampleName",
    //"collectionType": USER_COLLECTION,
    "rules": [
        {
            "name": "firstName",
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
            "name": "userName",
            "type": "string",
            "unique": true,
            "required": true
        },
        {
            "name": "today",
            "type": "date"
        }]
};

const sampleStoreData = {
    "age": 28,
    "firstName": "singh",
    "userName": "some_userName",
    "today":"30/09/2020 11:43:43"
};

describe('Çreate Data in Collection:Store', () => {

    it('Store:Unique - Returns error when duplicate name in rules', async () => {
        await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        type: 'number',
                        name: 'hello',
                        unique: true,
                        required: true
                    },
                ]
            })
            .expect(okayStatus);

        await request(app)
            .post(storeUrl)
            .send({
                ...sampleStoreData,
                hello: 56
            })
            .expect(okayStatus);

        const response = await request(app)
            .post(storeUrl)
            .send({
                ...sampleStoreData,
                hello: 56
            })
            .expect(errorStatus);
        console.log('response', response.body);
        expect(response.body.errors[0].message).toEqual('hello is already present in rules');
        expect(response.body.errors[0].field).toEqual('rules');
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
