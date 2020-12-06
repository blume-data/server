import {errorHandler, NotFoundError, serverApp} from '@ranjodhbirkaur/common';

serverApp.all('*', async () => {
  throw new NotFoundError();
});

serverApp.use(errorHandler);

export { serverApp as app };
