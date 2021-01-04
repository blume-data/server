export const stringLimitOptions = { min: 1, max: 40 };
export const stringLimitOptionErrorMessage = (field: string) => field+' must be present';
const ENV = '/:env';
export const serviceName = '/data';
export const rootUrl = `${serviceName}${ENV}`;

export const AUTH_TOKEN = 'AUTH_TOKEN';

export const MAX_USER_LIMIT = 1000;
export const MAX_COLLECTION_LIMIT = 1000;

export const PER_PAGE = 10;

export const RANJODHBIR_KAUR_DATABASE_URL = 'http://database-srv:3000/logs';

export const ENTRY_LANGUAGE_PROPERTY_NAME = 'ranjodhbir-kaur-language-property-name';
export const ENTRY_CREATED_AT = 'createdAt';
export const ENTRY_UPDATED_AT = 'updatedAt';
export const ENTRY_DELETED_AT = 'deletedAt';