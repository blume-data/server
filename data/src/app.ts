import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ranjodhbirkaur/common';
import cors from 'cors';
import compression from 'compression';

import {CollectionRoutes} from "./routes/collection";
import {StoreRoutes} from "./routes/store";
import {RoleRoutes} from "./routes/roles-routes";

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

app.use(RoleRoutes);
app.use(CollectionRoutes);
app.use(StoreRoutes);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
