import { app } from './app';

const start = async () => {
    app.listen(3000, () => {
        console.log('DataBase Service is Listening');
    });
};

start().then(() => console.log('DataBase started Everything'));
