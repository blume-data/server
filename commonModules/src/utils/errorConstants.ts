import {Response} from 'express';
import {ErrorMessages} from "../interface";
export const okayStatus = 202;
export const errorStatus = 400;

export const FIELD = 'field';
export const MESSAGE = 'message';

export function sendSingleError(res: Response, message: string, field?: string) {
    return res.status(errorStatus).send({
        [MESSAGE]: message,
        [FIELD]: field ? field : undefined
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