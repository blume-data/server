import {serverApp} from "@ranjodhbirkaur/common";
import { errorHandler, NotFoundError } from '@ranjodhbirkaur/common';
import {CollectionRoutes} from "./routes/collection-routes";
import {StoreRoutes} from "./routes/store";
import {RoleRoutes} from "./routes/roles-routes";
import {EventRoutes} from "./routes/events";
import { DataRoutes } from "./routes/data-routes";

serverApp.use(DataRoutes);
serverApp.use(RoleRoutes);
serverApp.use(CollectionRoutes);
serverApp.use(StoreRoutes);
serverApp.use(EventRoutes);

serverApp.all('*', async (req, res) => {
  throw new NotFoundError();
});

serverApp.use(errorHandler);

export { serverApp as app };
