import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../app';
import {adminType, adminUserType, clientUserType, okayStatus,
  emailVerification, logIn, register, userNameValidation
} from "@ranjodhbirkaur/common";
import {rootUrl} from "../util/constants";


interface DataType {
 userName?: string, email?: string, firstName?: string, lastName?: string, password?: string
}

declare global {
  namespace NodeJS {
    interface Global {
      signUp(userType: string, data?: DataType): Promise<{email: string, userName: string, cookie: any}>;
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

export function getUserNameValidationUrl(userType: string) {
  return `${rootUrl}/${userType}/${userNameValidation}`;
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

function getSampleData(data: DataType, userType: string) {
  return {
    ...sampleData,
    userName: data && data.userName ? data.userName : sampleData.userName,
    firstName: data && data.firstName ? data.firstName : sampleData.firstName,
    lastName: data && data.lastName ? data.lastName : sampleData.lastName,
    email: data && data.email ? data.email : sampleData.email,
    password: data && data.password ? data.password : sampleData.password,
    [adminType] : userType === adminUserType ? adminUserType : undefined
  };
}

global.signUp = async (userType: string, data?: DataType) => {

  sampleData = getSampleData(data || {}, userType);

  const registrationUrl = getRegistrationUrl(userType);
  const signInUrl = getSignInUrl(userType);

  const tempUser = await request(app)
      .post(registrationUrl)
      .send({
        ...sampleData,
      });

  if (userType !== adminUserType) {
    await request(app)
        .get(`${getEmailVerificationUrl(userType)}?email=${sampleData.email}&token=${tempUser.body.verificationToken}`)
        .expect(okayStatus);
  }

  const response = await request(app)
      .post(signInUrl)
      .send(sampleData)
      .expect(okayStatus);

  return {
    email: response.body.email,
    userName: response.body.userName,
    cookie: response.get('Set-Cookie')
  }

};
