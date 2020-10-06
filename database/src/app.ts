import {serverApp} from "@ranjodhbirkaur/common";
import { errorHandler, NotFoundError } from '@ranjodhbirkaur/common';
import {StoreRoutes} from "./routes/store";

serverApp.use(StoreRoutes);

serverApp.all('*', async () => {
    throw new NotFoundError();
});

serverApp.use(errorHandler);

export { serverApp as app };
