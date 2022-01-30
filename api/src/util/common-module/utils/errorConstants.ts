import {Response} from 'express';
import {ErrorMessages} from "../interface";
export const okayStatus = 202;
export const errorStatus = 400;
export const NOT_AUTHORISED_STATUS = 401;

export const FIELD = 'field';
export const MESSAGE = 'message';

export function sendSingleError(props: {
    res: Response, 
    message: string, 
    field?: string, 
    code?: number
}) {
    const {res, message, field, code = errorStatus} = props;
    return res.status(code).send({
        errors: [{
            [MESSAGE]: message,
            [FIELD]: field ? field : undefined
        }]
    })
}

export function sendErrors(res: Response, errorMessages: Array<ErrorMessages>) {
    return res.status(errorStatus).send({
        errors: errorMessages
    });
}

export function pushErrors(errorMessages: Array<ErrorMessages>, message: string, field?: string) {
    errorMessages.push({
        message, field
    });
}