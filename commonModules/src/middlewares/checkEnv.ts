import {NextFunction, Request, Response} from "express";

export const PRODUCTION_ENV = 'production';
export const DEVELOPMENT_ENV = 'development';
export const SUPPORTED_ENVS = [PRODUCTION_ENV, DEVELOPMENT_ENV];
const ENV_IS_NOT_SUPPORTED = 'env is not supported';
const errorStatus = 400;

export function validateEnvType(req: Request, res: Response, next: NextFunction ) {
    const envType = req.params && req.params.env;
    const exist = SUPPORTED_ENVS.find((item: string) => item === envType);
    if (exist) {
        next();
    }
    else {
        res.status(errorStatus).send({
            errors: [{
                message: ENV_IS_NOT_SUPPORTED,
                field: 'env'
            }]
        });
    }
}