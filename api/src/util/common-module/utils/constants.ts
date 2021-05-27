export const EVENTS_ROUTE = 'events';
export const EVENT_AUTH_NEW_JWT = 'EVENT_AUTH_NEW_JWT';
export const JWT_COOKIE_NAME = 'RANJODHBIR_KAUR_AUTHENTICATION_JWT';
export const CLIENT_USER_MODEL_NAME = 'ClientUser';

// get mongo database url
export function getMongoDatabaseUrl() {
    return 'mongodb+srv://all:all@cluster0.a6c0l.mongodb.net/ranjodh?retryWrites=true&w=majority';
}
// mongo database connect options
export const mongoConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};

export const JWT_KEY = 'hello singh ji you are so good';
export const MAX_NUMBER_FIELD_TYPES = 10;