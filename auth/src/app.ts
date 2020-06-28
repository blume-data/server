import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ranjodhbirkaur/common';
import cors from 'cors';
import compression from 'compression';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import {routes} from "./routes";

const app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(compression());
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);
app.options('*', cors());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(routes);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
