import {serverApp} from "@ranjodhbirkaur/common";
import { errorHandler, NotFoundError } from '@ranjodhbirkaur/common';
import {CollectionRoutes} from "./routes/collection-routes";
import {StoreRoutes} from "./routes/store";
import {EventRoutes} from "./routes/events";
import { DataRoutes } from "./routes/data-routes";
import { ApplicationNameRoutes } from "./routes/application-name-routes";

serverApp.use(DataRoutes);
serverApp.use(ApplicationNameRoutes);
//serverApp.use(RoleRoutes);
serverApp.use(CollectionRoutes);
serverApp.use(StoreRoutes);
serverApp.use(EventRoutes);

serverApp.all('*', async () => {
  throw new NotFoundError();
});

serverApp.use(errorHandler);

export { serverApp as app };
