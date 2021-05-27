import mongoose from 'mongoose';
import {errorHandler, getMongoDatabaseUrl, mongoConnectOptions, NotFoundError} from "./util/common-module";
import {serverApp} from "./serverApp";
import {ApplicationNameRouter} from "./modules/model-collections/routes/application-name-routes";
import {CollectionRoutes} from "./modules/model-collections/routes/collection-routes";
import {StoreRoutes} from "./modules/entries/Routes/store";
import {SettingRoutes} from "./modules/model-collections/routes/setting-routes";
import userAgent from 'express-useragent';
import {assetsRoutes} from "./modules/assets/routes";
import {EnvRouter, currentUserRouter, addressRoutes, signinRouter, signoutRouter, signupRouter, validationRoutes} from './modules/auth/routes';
import { createOtherUsersRouter } from './modules/auth/routes/create-other-users-route';

const start = async () => {

  const MONGO_URL = getMongoDatabaseUrl();
  try {
    await mongoose.connect(MONGO_URL, mongoConnectOptions);
    console.log('Data Service: Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  // data module
  serverApp.use(ApplicationNameRouter);
  serverApp.use(CollectionRoutes);
  serverApp.use(StoreRoutes);
  serverApp.use(SettingRoutes);

  // Auth Module
  serverApp.use(userAgent.express());
  serverApp.use(addressRoutes);
  serverApp.use(currentUserRouter);
  serverApp.use(signinRouter);
  serverApp.use(signoutRouter);
  serverApp.use(signupRouter);
  serverApp.use(validationRoutes);
  serverApp.use(EnvRouter);
  serverApp.use(createOtherUsersRouter);

  // Asset Module
  serverApp.use(assetsRoutes);

  serverApp.all('*', async () => {
    throw new NotFoundError();
  });

  serverApp.use(errorHandler);

  serverApp.listen(4000, () => {
    console.log('Data Service: Server is Listening!');
  });
};

start().then(() => console.log('started Everything'));
