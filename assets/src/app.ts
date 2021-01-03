import {errorHandler, NotFoundError, serverApp} from '@ranjodhbirkaur/common';
import {assetsRoutes} from './routes';

serverApp.use(assetsRoutes);

serverApp.all('*', async () => {
  throw new NotFoundError();
});

serverApp.use(errorHandler);

export { serverApp as app };
