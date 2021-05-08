import {Response, Request, NextFunction} from 'express';
import {BadRequestError, EnglishLanguage, SpanishLanguage} from "./common-module";
export const SUPPORTED_LANGUAGES = [EnglishLanguage, SpanishLanguage];

export function validateLanguage(req: Request, res: Response, next: NextFunction ) {
    const language = req.body && req.body.language || EnglishLanguage;
    const exist = SUPPORTED_LANGUAGES.find((item: string) => item === language);
    if (exist) {
        next();
    }
    else {
        throw new BadRequestError('Language is not supported');
    }
}