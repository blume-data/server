export const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://api.blumedata.store'
    : 'https://dev.blumedata.store';

export const baseUrlDataEnv = `${baseUrl}/data/production`;

export const env = process.env.NODE_ENV;

export const randomString = () => {
    return Math.random().toString(36).substring(10);
};

export const BRAND_NAME = 'Blumedata';

export const AUTH_TOKEN = 'AUTH_TOKEN';
export const USER_NAME = 'userName';

export function isUserLoggedIn() {
    return localStorage.getItem(AUTH_TOKEN);
}

export const SchemaTypes = [
    {value: 'string', label: 'String'},
    {value: 'number', label: 'Number'},
    {value: 'boolean', label: 'Boolean'},
];

export const okayStatus = 202;
export const errorStatus = 400;


// collection types
export const USER_COLLECTION = 'user_collection';
export const DATA_COLLECTION = 'data_collection';
export const COLLECTION_TYPES = [USER_COLLECTION, DATA_COLLECTION];