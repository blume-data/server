import { randomBytes } from 'crypto';
export const RANDOM_STRING = function (minSize=4) {
    return randomBytes(minSize).toString('hex')
};