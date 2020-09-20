import {errorHandler, NotFoundError} from '@ranjodhbirkaur/common';
import {serverApp} from "@ranjodhbirkaur/common";
import events from 'events';
export const eventEmitter = new events.EventEmitter();


// Routes here


serverApp.all('*', async () => {
  throw new NotFoundError();
});

serverApp.use(errorHandler);

export { serverApp as app };
