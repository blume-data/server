import {NotFoundError, serverApp} from '@ranjodhbirkaur/common';
import 'express-async-errors';

import {currentUserRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signoutRouter} from './routes/signout';
import {signupRouter} from './routes/signup';
import {routes} from "./routes";
import {checkAuthRoutes} from "./routes/checkAuth";

const app = serverApp;

app.use(checkAuthRoutes);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(routes);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

export { app };
