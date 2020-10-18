export const stringLimitOptions = { min: 1, max: 40 };
export const stringLimitOptionErrorMessage = (field: string) => field+' must be present';
const ENV = '/:env';
export const serviceName = '/data';
export const rootUrl = `${serviceName}${ENV}`;

export const AUTH_TOKEN = 'AUTH_TOKEN';

export const DATE_TYPE = 'date';
export const HTML_TYPE = 'html';
export const SUPPORTED_DATA_TYPES = ['string', 'boolean', 'number', 'date', 'html'];

export const MAX_USER_LIMIT = 1000;
export const MAX_COLLECTION_LIMIT = 1000;

export const PER_PAGE = 10;

const dataBaseSrvOne = 'dataBaseSrvOne';

export const STORE_CONNECTIONS = [{
    name: dataBaseSrvOne,
    url: 'http://database-srv:3000/store'
}];

export const USER_COLLECTION = 'user_collection';
export const DATA_COLLECTION = 'data_collection';
export const COLLECTION_TYPES = [USER_COLLECTION, DATA_COLLECTION];
export const MONGO_DB_DATA_CONNECTIONS_AVAILABLE = ['one','two'];

export const AUTHORIZATION_TOKEN = 'authorization';
export const MODEL_LOGGER_NAME = 'model-logs-schema-space-i-love-ranjodh-bir-kaur';