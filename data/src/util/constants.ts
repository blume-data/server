export const stringLimitOptions = { min: 1, max: 40 };
export const stringLimitOptionErrorMessage = (field: string) => field+' must be present';
const ENV = '/:env';
export const serviceName = '/data';
export const rootUrl = `${serviceName}${ENV}`;

export const AUTH_TOKEN = 'AUTH_TOKEN';

export const MAX_USER_LIMIT = 1000;
export const MAX_COLLECTION_LIMIT = 1000;

export const PER_PAGE = 10;

export const RANJODHBIR_KAUR_DATABASE_URL = 'http://database-srv:3000/store';

export const MONGO_DB_DATA_CONNECTIONS_AVAILABLE = ['one','two'];

export const AUTHORIZATION_TOKEN = 'authorization';
export const MODEL_LOGGER_NAME = 'model-logs-schema-space-i-love-ranjodh-bir-kaur';