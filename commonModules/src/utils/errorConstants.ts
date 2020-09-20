import {Response} from 'express';
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