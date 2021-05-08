export const stringLimitOptions = { min: 1, max: 40 };
export const stringLimitOptionErrorMessage = (field: string) => field+' must be present';
const ENV = '/:env';
export const serviceName = '/api/data';
export const rootUrl = `${serviceName}${ENV}`;

export const AUTH_TOKEN = 'AUTH_TOKEN';

export const MAX_COLLECTION_LIMIT = 1000;

export const PER_PAGE = 10;

export const ENTRY_LANGUAGE_PROPERTY_NAME = 'ranjodhbir-kaur-language-property-name';
// store time zone of dates also
export const TIMEZONE_DATE_CONSTANT = 'timezone';