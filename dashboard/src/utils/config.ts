export const ROOT_URL = (() => {
    console.log('Current ENV is ', process.env.REACT_APP_ENV);
    switch (process.env.REACT_APP_ENV) {
        case 'development': {
            return 'https://dev.ranjod.com';
        }
        case 'production': {
            return 'https://api.ranjod.com'
        }
        case 'test': {
            return 'http://localhost:4000'
        }
    }
})();