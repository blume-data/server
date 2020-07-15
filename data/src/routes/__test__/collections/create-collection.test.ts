import request from 'supertest';
import { app } from '../../../app';
import {errorStatus, okayStatus, rootUrl, USER_COLLECTION} from "../../../util/constants";
import {RANDOM_STRING} from "../../../util/methods";
import {
    EMAIL_PROPERTY_IN_RULES_SHOULD_BE_STRING, INVALID_RULES_MESSAGE,
    IS_EMAIL_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    IS_PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN,
    PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_STRING
} from "../../../Controllers/Messages";
import {PRODUCTION_ENV} from "../../../util/enviornmentTypes";

const sampleUserName = RANDOM_STRING(10);
const collectionUrl = `${rootUrl}/en/${sampleUserName}/collection`;

const sampleData = {
    "name": RANDOM_STRING(6),
    "env": PRODUCTION_ENV,
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

describe('Collection:Create', () => {

    it('Collection: Collection can be created', async () => {
        const response = await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(okayStatus);

        expect(response.body.isEnabled).toEqual(true);
        expect(response.body.language).toEqual('en');
        expect(response.body.userName).toEqual(sampleUserName);
        expect(response.body.name).toEqual(sampleData.name);
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

    it('Collection: Returns error on invalid collection type', async () => {
        const response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                collectionType: 'invalid_type'
            })
            .expect(errorStatus);
        expect(response.body.errors[0].message).toEqual('invalid_type is not a valid collectionType');
        expect(response.body.errors[0].field).toEqual('collectionType');
    });

    it('Collection: Returns error on invalid rule type', async () => {
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

    it('Collection:Required - type should be boolean', async () => {
        const response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        type: 'number',
                        name: 'hello',
                        required: 'required'
                    }
                ]
            })
            .expect(errorStatus);

        expect(response.body.errors[0].message).toEqual('hello: required property in the rules should be boolean');
        expect(response.body.errors[0].field).toEqual('rules');
    });

    it('Collection:DuplicateName - Returns error when duplicate name in rules', async () => {
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

    it('Collection:Default - value should be of valid type', async () => {
        const response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        type: 'number',
                        name: 'hello',
                        default: 'invalid_defaultValue'
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

    it('Collection: Unique / isEmail / isPassword - value is checked', async () => {
        let response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        name: "someName",
                        unique: 'notBoolean'
                    }
                ]
            });
        expect(response.body.errors[0].message).toContain("unique property in the rules should be boolean");
        expect(response.body.errors[0].field).toEqual('rules');

        response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        name: "someName",
                        type: "string",
                        isEmail: 'notBoolean'
                    }
                ]
            });
        expect(response.body.errors[0].message).toContain(`${IS_EMAIL_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`);
        expect(response.body.errors[0].field).toEqual('rules');

        response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        name: "someName",
                        type: "string",
                        isPassword: 'notBoolean'
                    }
                ]
            });
        expect(response.body.errors[0].message).toContain(`${IS_PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_BOOLEAN}`);
        expect(response.body.errors[0].field).toEqual('rules');

        response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        name: "someName",
                        type: "number",
                        isEmail: true
                    }
                ]
            });
        expect(response.body.errors[0].message).toContain(`${EMAIL_PROPERTY_IN_RULES_SHOULD_BE_STRING}`);
        expect(response.body.errors[0].field).toEqual('rules');

        response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: [
                    ...sampleData.rules,
                    {
                        name: "someName",
                        type: "number",
                        isPassword: true
                    }
                ]
            });
        expect(response.body.errors[0].message).toContain(`${PASSWORD_PROPERTY_IN_RULES_SHOULD_BE_STRING}`);
        expect(response.body.errors[0].field).toEqual('rules');
    });

    it('Collection:Invalid Rules - Error when we send invalid rules', async () => {
        const response = await request(app)
            .post(collectionUrl)
            .send({
                ...sampleData,
                rules: 'taranjeetsingh'
            })
            .expect(errorStatus);

        expect(response.body.errors[0].message).toContain(INVALID_RULES_MESSAGE);
        expect(response.body.errors[0].field).toEqual('rules');
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
                required: true,
                isEmail: true
            },
            {
                name: 'password',
                type: 'string',
                required: true,
                isPassword: true,
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


