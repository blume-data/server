import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../app';
import {emailVerification, logIn, register} from "../util/urls";
import {okayStatus, clientUserType} from "@ranjodhbirkaur/common";
import {rootUrl} from "../util/constants";


interface DataType {
 userName?: string, email?: string, firstName?: string, lastName?: string, password?: string
}

declare global {
  namespace NodeJS {
    interface Global {
      signIn(userType: string, data?: DataType): Promise<string[]>;
      signUp(userType: string, data?: DataType): Promise<{email: string, userName: string}>;
    }
  }
}
jest.setTimeout(30000);

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asd';
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

export function getEmailVerificationUrl(userType: string) {
  return `${rootUrl}/${userType}/${emailVerification}`;
}

export function getRegistrationUrl(userType: string) {
  return `${rootUrl}/${userType}/${register}`;
}

export function getSignInUrl(userType: string) {
  return `${rootUrl}/${userType}/${logIn}`;
}

export interface SampleDataType {
  email: string;
  password: string,
  firstName: string;
  lastName: string;
  userName: string;
  adminType?: string;
}

let sampleData: SampleDataType = {
  "email": "test@test.com",
  "password": "testtest",
  "firstName": "Taranjeet",
  "lastName": "Singh",
  "userName": "taranjeet"
};

function getSampleData(data: DataType) {
  return {
    ...sampleData,
    userName: data && data.userName ? data.userName : sampleData.userName,
    firstName: data && data.firstName ? data.firstName : sampleData.firstName,
    lastName: data && data.lastName ? data.lastName : sampleData.lastName,
    email: data && data.email ? data.email : sampleData.email,
    password: data && data.password ? data.password : sampleData.password,
  };
}

global.signIn = async (userType: string, data?: DataType) => {

  const registrationUrl = getRegistrationUrl(userType);
  const signInUrl = getSignInUrl(userType);

  if (data) {
    sampleData = getSampleData(data);
  }

  const tempUser = await request(app)
      .post(registrationUrl)
      .send(sampleData)
      .expect(okayStatus);

  await request(app)
      .get(`${getEmailVerificationUrl(clientUserType)}?email=${sampleData.email}&token=${tempUser.body.verificationToken}`)
      .expect(okayStatus);

  const response = await request(app)
    .post(signInUrl)
    .send({
      email: sampleData.email,
      password: sampleData.password
    })
    .expect(okayStatus);

  return response.get('Set-Cookie');
};

global.signUp = async (userType: string, data?: DataType) => {

  if (data) {
    sampleData = {
      ...sampleData,
      userName: data && data.userName ? data.userName : sampleData.userName,
      firstName: data && data.firstName ? data.firstName : sampleData.firstName,
      lastName: data && data.lastName ? data.lastName : sampleData.lastName,
      email: data && data.email ? data.email : sampleData.email,
      password: data && data.password ? data.password : sampleData.password,
    };
  }

  const registrationUrl = getRegistrationUrl(userType);
  const signInUrl = getSignInUrl(userType);

  const tempUser = await request(app)
      .post(registrationUrl)
      .send({
        ...sampleData,

      })
      .expect(okayStatus);

  await request(app)
      .get(`${getEmailVerificationUrl(userType)}?email=${sampleData.email}&token=${tempUser.body.verificationToken}`)
      .expect(okayStatus);

  const response = await request(app)
      .post(signInUrl)
      .send(sampleData)
      .expect(okayStatus);

  return {
    email: response.body.email,
    userName: response.body.userName
  }

};
