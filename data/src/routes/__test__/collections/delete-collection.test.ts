import {RANDOM_STRING} from "../../../util/methods";
import {errorStatus, okayStatus, rootUrl} from "../../../util/constants";
import request from "supertest";
import {app} from "../../../app";
import {PRODUCTION_ENV} from "../../../util/enviornmentTypes";

const sampleUserName = RANDOM_STRING(10);
const collectionUrl = `${rootUrl}/${PRODUCTION_ENV}/en/${sampleUserName}/collection`;
const sampleCollectionName = RANDOM_STRING();
const sampleData = {
    "name": sampleCollectionName,
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

describe('Collection:Delete', () => {
    it('Deletes a Collection', async () => {
       // create a collection
        await request(app)
            .post(collectionUrl)
            .send(sampleData)
            .expect(okayStatus);

        await request(app)
            .delete(collectionUrl)
            .send({
                name: sampleCollectionName
            })
            .expect(okayStatus);
    });

    it('Error on delete invalid collection', async () => {
        await request(app)
            .delete(collectionUrl)
            .send({
                name: sampleCollectionName
            })
            .expect(errorStatus);
    })
});