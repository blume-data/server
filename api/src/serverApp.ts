import 'express-async-errors';
import express, {Request, Response, NextFunction} from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import compression from 'compression';

const serverApp = express();
serverApp.use(cors());
//serverApp.set('trust proxy', true);
serverApp.use(compression());
serverApp.use(json());

export {serverApp, Response, Request, NextFunction};
