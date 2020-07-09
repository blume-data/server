import request from 'supertest';
import { app } from '../../app';
import {errorStatus, okayStatus, rootUrl, USER_COLLECTION} from "../../util/constants";

const collectionUrl = `${rootUrl}/en/sampleUserName/collection`;
const sampleData = {
    "userName": "sampleUserName",
    "name": "sampleName",
    "rules": [
        {
        "name": "lastName",
        "default":"defaultName",
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

describe('Collection Validation', () => {

    it('Collection: Collection can be created', async () => {
        await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(okayStatus);
    });

    it('Collection: Returns Error on create duplicate collection.', async () => {
        await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(okayStatus);
        await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(errorStatus);
    });

    it('Collection: Returns error on invalid type', async () => {
        await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        type: 'invalid_type',
                        name: 'hello'
                    }
                ]
            })
            .expect(errorStatus);
    });

    it('Collection: Required type should be boolean', async () => {
        await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        type: 'number',
                        name: 'hello',
                        required: 'dsff'
                    }
                ]
            })
            .expect(errorStatus);
    });

    it('Collection: Returns error when duplicate name in rules', async () => {
        await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        type: 'number',
                        name: 'hello',
                        required: true
                    },
                    {
                        type: 'number',
                        name: 'hello',
                        required: true
                    }
                ]
            })
            .expect(errorStatus);
    });

    it('Collection: Default value should be of valid type', async () => {
        await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        type: 'number',
                        name: 'hello',
                        default: 'dsff'
                    }
                ]
            })
            .expect(errorStatus);
    });

    it('User Collection: creat the user collection even when email & password is not present', async () => {
        const response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                collectionType: USER_COLLECTION
            })
            .expect(okayStatus);
    });

    it('User Collection: creat the user collection even when email & password is present', async () => {
        const response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                collectionType: USER_COLLECTION,
                rules: [
                    ...sampleData.rules,
                    {
                        name: "email",
                        type: "string"
                    },
                    {
                        name: "password",
                        type: "string"
                    }
                ]
            })
            .expect(okayStatus);

        console.log('resp', response.body);
    });
});


