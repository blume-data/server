import { randomBytes } from 'crypto';
export const RANDOM_STRING = function (minSize=4) {
    return randomBytes(minSize).toString('hex')
};

export const RANDOM_COLLECTION_NAME = function (min=1000, max=1010) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};