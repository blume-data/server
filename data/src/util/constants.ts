export const stringLimitOptions = { min: 1, max: 40 };
export const stringLimitOptionErrorMessage = (field: string) => field+' must be present';
export const rootUrl = '/data';
export const okayStatus = 202;
export const errorStatus = 400;

export const AUTH_TOKEN = 'AUTH_TOKEN';
export const USER_NAME = 'userName';

export const SUPPORTED_DATA_TYPES = ['string', 'boolean', 'number', 'date', 'html'];

export const MONGO_DB_DATA_CONNECTIONS_AVAILABLE = ['one','two'];

export const MAX_DB_LIMIT = 10000;

export const MAX_COLLECTION_LIMIT = 10000;

export const ALL_CONNECTIONS_AND_DB_CAPACITY_FULL = 'All connections and db capacity is full';

export const PER_PAGE = 10;

export const USER_COLLECTION = 'user_collection';
export const DATA_COLLECTION = 'data_collection';
export const COLLECTION_TYPES = [USER_COLLECTION, DATA_COLLECTION];