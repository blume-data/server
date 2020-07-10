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
        const response = await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(okayStatus);

        expect(response.body.isEnabled).toEqual(true);
        expect(response.body.language).toEqual('en');
        expect(response.body.userName).toEqual('sampleUserName');
        expect(response.body.name).toEqual('sampleName');
        expect(response.body.rules).toEqual(JSON.stringify(sampleData.rules));
        expect(response.body.id).toBeDefined();
        expect(response.body.dbName).toBeDefined();
        expect(response.body.connectionName).toBeDefined();
        expect(response.body.collectionType).toBeDefined();
        expect(response.body.created_at).toBeDefined();
    });

    it('Collection: Returns Error on create duplicate collection.', async () => {
        await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(okayStatus);
        const response = await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(errorStatus);
        expect(response.body.errors[0].message).toEqual('collection already exist');
    });

    it('Collection: Returns error on invalid type', async () => {
        const response = await request(app)
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
        expect(response.body.errors[0].message).toEqual('hello is of invalid type invalid_type');
        expect(response.body.errors[0].field).toEqual('rules');
    });

    it('Collection: Required type should be boolean', async () => {
        const response = await request(app)
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

        expect(response.body.errors[0].message).toEqual('hello: required property in the rules should be boolean');
        expect(response.body.errors[0].field).toEqual('rules');
    });

    it('Collection: Returns error when duplicate name in rules', async () => {
        const response = await request(app)
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
        expect(response.body.errors[0].message).toEqual('hello is already present in rules');
        expect(response.body.errors[0].field).toEqual('rules');
    });

    it('Collection: Default value should be of valid type', async () => {
        const response = await request(app)
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
        expect(response.body.errors).toEqual([
            {
                "message": "hello: default value should be of type number",
                "field": "rules"
            }
        ]);
    });

    it('User Collection: creates the user collection even when email & password is not present', async () => {
        const response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                collectionType: USER_COLLECTION
            })
            .expect(okayStatus);
        expect(response.body.collectionType).toEqual(USER_COLLECTION);
        expect(response.body.rules).toEqual(JSON.stringify([
            ...sampleData.rules,
            {
                name: 'email',
                type: 'string',
                unique: true,
                isEmail: true
            },
            {
                name: 'password',
                type: 'string',
                isPassword: true
            }
        ]))
    });

    it('User Collection: creates the user collection even when email & password is present', async () => {
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

        expect(response.body.collectionType).toEqual(USER_COLLECTION);
        expect(response.body.id).toBeDefined();
        expect(response.body.rules).toEqual(JSON.stringify([
            ...sampleData.rules,
            {
                name: "email",
                type: "string"
            },
            {
                name: "password",
                type: "string"
            }
        ]))
    });
});


