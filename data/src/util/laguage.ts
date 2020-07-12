import {Response, Request, NextFunction} from 'express';
import {BadRequestError} from "@ranjodhbirkaur/common";
export const English = 'en';
export const Spanish = 'ea';

export const SUPPORTED_LANGUAGES = [English, Spanish];

export function validateLanguage(req: Request, res: Response, next: NextFunction ) {
    const language = req.body && req.body.language || English;
    const exist = SUPPORTED_LANGUAGES.find((item: string) => item === language);
    if (exist) {
        next();
    }
    else {
        throw new BadRequestError('Language is not supported');
    }
}