import {RANDOM_STRING} from "../../../util/methods";
import {errorStatus, okayStatus, serviceName} from "../../../util/constants";
import request from "supertest";
import {app} from "../../../app";
import {PRODUCTION_ENV} from "../../../util/enviornmentTypes";

const sampleUserName = RANDOM_STRING(10);
const collectionUrl = `${serviceName}/${PRODUCTION_ENV}/en/${sampleUserName}/collection`;
const sampleCollectionName = RANDOM_STRING();
const sampleData = {
    "name": sampleCollectionName,
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

describe('Collection:Get', () => {
    it('Gets a Collection', async () => {
       // create a collection
        await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(okayStatus);

        await request(app)
            .get(collectionUrl)
            .send({
                name: sampleCollectionName
            })
            .expect(okayStatus);
    });
});