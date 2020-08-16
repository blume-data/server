import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import compression from 'compression';

import {errorHandler} from "..";

const app = express();

app.use(cors());
app.set('trust proxy', true);
app.use(compression());
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false
}));
app.options('*', cors());

app.use(errorHandler);

export { app as serverApp};
