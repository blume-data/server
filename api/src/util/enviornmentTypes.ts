import {NextFunction, Request, Response} from "express";
import {ENV_IS_NOT_SUPPORTED} from "../Controllers/Messages";
import {
    CUSTOM_ONE_ENV,
    CUSTOM_Three_ENV,
    CUSTOM_TWO_ENV, DEVELOPMENT_ENV,
    LOCAL_ENV,
    PRODUCTION_ENV, SANDBOX_ENV,
    STAGE_ENV,
    TEST_ENV, errorStatus
} from "@ranjodhbirkaur/constants";

export const SUPPORTED_ENVS = [
    PRODUCTION_ENV, DEVELOPMENT_ENV, CUSTOM_ONE_ENV,
    CUSTOM_Three_ENV, CUSTOM_TWO_ENV, SANDBOX_ENV,
    STAGE_ENV, TEST_ENV, LOCAL_ENV
];

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