import {RANDOM_STRING} from "../../../util/methods";
import {errorStatus, okayStatus, rootUrl} from "../../../util/constants";
import request from "supertest";
import {app} from "../../../app";

const sampleUserName = RANDOM_STRING(10);
const collectionUrl = `${rootUrl}/en/${sampleUserName}/collection`;
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

describe('Multiple Collections', () => {
    it('measure performace a Collection', async () => {

    });
});