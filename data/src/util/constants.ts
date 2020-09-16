export const stringLimitOptions = { min: 1, max: 40 };
export const stringLimitOptionErrorMessage = (field: string) => field+' must be present';
const ENV = '/:env';
export const serviceName = '/data';
export const rootUrl = `${serviceName}${ENV}`;
export const okayStatus = 202;
export const errorStatus = 400;

export const AUTH_TOKEN = 'AUTH_TOKEN';
export const USER_NAME = 'userName';

export const DATE_TYPE = 'date';
export const HTML_TYPE = 'html';
export const SUPPORTED_DATA_TYPES = ['string', 'boolean', 'number', 'date', 'html'];

export const MAX_COLLECTION_LIMIT = 50;

export const PER_PAGE = 10;

export const USER_COLLECTION = 'user_collection';
export const DATA_COLLECTION = 'data_collection';
export const COLLECTION_TYPES = [USER_COLLECTION, DATA_COLLECTION];

export const AUTHORIZATION_TOKEN = 'authorization';