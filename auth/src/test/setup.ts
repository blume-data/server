import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import {emailVerificationUrl, signIn, signUp} from "../util/urls";
import {okayStatus} from "../util/constants";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdfj';
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

global.signin = async () => {

  const sampleData = {
    "email": "test@test.com",
    "password": "testtest",
    "firstName": "Taranjeet",
    "lastName": "Singh",
    "userName": "taranjeet"
  };

  const tempUser = await request(app)
      .post(signUp)
      .send(sampleData)
      .expect(okayStatus);

  await request(app)
      .get(`${emailVerificationUrl}?email=${sampleData.email}&token=${tempUser.body.verificationToken}`)
      .expect(okayStatus);

  const response = await request(app)
    .post(signIn)
    .send({
      email: sampleData.email,
      password: sampleData.password
    })
    .expect(okayStatus);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
