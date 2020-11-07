import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    app.listen(3000, () => {
        console.log('DataBase Service: Server is Listening');
    });
};

start().then(() => console.log('DataBase started Everything'));
