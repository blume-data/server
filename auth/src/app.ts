import {errorHandler, NotFoundError} from '@ranjodhbirkaur/common';
import {currentUserRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signoutRouter} from './routes/signout';
import {signupRouter} from './routes/signup';
import {routes} from "./routes";
import {serverApp} from "@ranjodhbirkaur/common";
import {addressRoutes} from "./routes/addresses";
import userAgent from 'express-useragent';

serverApp.use(userAgent.express());
serverApp.use(addressRoutes);
serverApp.use(currentUserRouter);
serverApp.use(signinRouter);
serverApp.use(signoutRouter);
serverApp.use(signupRouter);
serverApp.use(routes);


serverApp.all('*', async () => {
  throw new NotFoundError();
});

serverApp.use(errorHandler);

export { serverApp as app };
