import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "@ranjodhbirkaur/common";

export const PRODUCTION_ENV = 'production';
export const DEVELOPMENT_ENV = 'development';

export const SUPPORTED_ENVS = [PRODUCTION_ENV, DEVELOPMENT_ENV];

export function validateEnvType(req: Request, res: Response, next: NextFunction ) {
    const envType = req.body && req.body.env;
    const exist = SUPPORTED_ENVS.find((item: string) => item === envType);
    if (exist) {
        next();
    }
    else {
        throw new BadRequestError('Env type is not supported');
    }
}