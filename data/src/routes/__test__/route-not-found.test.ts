import request from "supertest";
import {app} from "../../app";
import {errorStatus} from "../../util/constants";


describe('Gives error on route not found', () => {
    it('Error', async () => {
        await request(app)
            .post('some-invalid-url')
            .expect(errorStatus);
    });
});