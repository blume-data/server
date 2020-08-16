import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import {emailVerification, register, signInUrl} from "../util/urls";
import {okayStatus} from "@ranjodhbirkaur/common";
import {rootUrl} from "../util/constants";
import {clientUserType} from "../middleware/userTypeCheck";

declare global {
  namespace NodeJS {
    interface Global {
      signIn(userType: string): Promise<string[]>;
    }
  }
}
jest.setTimeout(30000);
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdfjkkjjkhjkhjkhjkhjkhkjhkjhkjhkjhkjhkjhjkhkjhjkhkjhkjhkjhkjhjkhkjhkjhjkhjkhhkh';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

const emailVerificationUrl = `${rootUrl}/${clientUserType}/${emailVerification}`;

global.signIn = async (userType: string) => {

  const registrationUrl = `${rootUrl}/${userType}/${register}`;

  const sampleData = {
    "email": "test@test.com",
    "password": "testtest",
    "firstName": "Taranjeet",
    "lastName": "Singh",
    "userName": "taranjeet"
  };

  const tempUser = await request(app)
      .post(registrationUrl)
      .send(sampleData)
      .expect(okayStatus);

  await request(app)
      .get(`${emailVerificationUrl}?email=${sampleData.email}&token=${tempUser.body.verificationToken}`)
      .expect(okayStatus);

  const response = await request(app)
    .post(registrationUrl)
    .send({
      email: sampleData.email,
      password: sampleData.password
    })
    .expect(okayStatus);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
