import mongoose from 'mongoose';
import {errorHandler, getMongoDatabaseUrl, mongoConnectOptions, NotFoundError} from "./util/common-module";
import {serverApp} from "./serverApp";
import {ApplicationNameRoutes} from "./modules/model-collections/routes/application-name-routes";
import {CollectionRoutes} from "./modules/model-collections/routes/collection-routes";
import {StoreRoutes} from "./modules/entries/Routes/store";
import {SettingRoutes} from "./modules/model-collections/routes/setting-routes";
import {EventRoutes} from "./modules/model-collections/routes/events";
import {addressRoutes} from "./modules/auth/routes/addresses";
import {currentUserRouter} from "./modules/auth/routes/current-user";
import {signinRouter} from "./modules/auth/routes/signin";
import {signoutRouter} from "./modules/auth/routes/signout";
import {signupRouter} from "./modules/auth/routes/signup";
import {routes} from "./modules/auth/routes";
import userAgent from 'express-useragent';
import {assetsRoutes} from "./modules/assets/routes";
import { EnvRouter } from './modules/auth/routes/env-route';

const start = async () => {

  const MONGO_URL = getMongoDatabaseUrl();
  try {
    await mongoose.connect(MONGO_URL, mongoConnectOptions);
    console.log('Data Service: Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  // data module
  serverApp.use(ApplicationNameRoutes);
  serverApp.use(CollectionRoutes);
  serverApp.use(StoreRoutes);
  serverApp.use(SettingRoutes);
  serverApp.use(EventRoutes);

  // Auth Module
  serverApp.use(userAgent.express());
  serverApp.use(addressRoutes);
  serverApp.use(currentUserRouter);
  serverApp.use(signinRouter);
  serverApp.use(signoutRouter);
  serverApp.use(signupRouter);
  serverApp.use(routes);
  serverApp.use(EnvRouter);

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
