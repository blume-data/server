import 'express-async-errors';
import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import compression from 'compression';

const serverApp = express();

serverApp.use(cors());
serverApp.set('trust proxy', true);
serverApp.use(compression());
serverApp.use(json());
serverApp.use(cookieSession({
    signed: false,
    secure: false
}));
serverApp.options('*', cors());

export {serverApp};
