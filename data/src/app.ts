import {serverApp} from "@ranjodhbirkaur/common";
import { errorHandler, NotFoundError } from '@ranjodhbirkaur/common';
import {CollectionRoutes} from "./routes/collection-routes";
import {StoreRoutes} from "./routes/store";
import { ApplicationNameRoutes } from "./routes/application-name-routes";
import { SettingRoutes } from "./routes/setting-routes";
import {EventRoutes} from "./routes/events";

serverApp.use(ApplicationNameRoutes);
serverApp.use(CollectionRoutes);
serverApp.use(StoreRoutes);
serverApp.use(SettingRoutes);
serverApp.use(EventRoutes);

serverApp.all('*', async () => {
  throw new NotFoundError();
});

serverApp.use(errorHandler);

export { serverApp as app };
