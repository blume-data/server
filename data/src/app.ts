import {serverApp} from "@ranjodhbirkaur/common";
import { errorHandler, NotFoundError } from '@ranjodhbirkaur/common';
import {CollectionRoutes} from "./routes/collection-routes";
import {StoreRoutes} from "./routes/store";
import {RoleRoutes} from "./routes/roles-routes";

serverApp.use(RoleRoutes);
serverApp.use(CollectionRoutes);
serverApp.use(StoreRoutes);

serverApp.all('*', async (req, res) => {
  throw new NotFoundError();
});

serverApp.use(errorHandler);

export { serverApp as app };
