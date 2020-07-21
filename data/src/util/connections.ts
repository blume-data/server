import mongoose from "mongoose";
import {MONGO_DB_DATA_CONNECTIONS_AVAILABLE} from "./constants";
import {Connection} from "mongoose";

const availableConnection: {name: string, dbConnection: Connection}[] = [];

/*Invoke this method on init*/
export async function initClientDbConnection(callBack: () => void) {

    for (const connectionName of MONGO_DB_DATA_CONNECTIONS_AVAILABLE) {
        const dbConnection = await mongoose.createConnection(`mongodb://data-mongo-${connectionName}-srv/${connectionName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        availableConnection.push({
            name: connectionName,
            dbConnection
        });
    }
    callBack();
}

export function getConnection(name: string) {
    const exist = availableConnection.find(item => item.name === name);
    if (exist && exist.dbConnection) {
        return exist.dbConnection;
    }
    else {
        throw new Error('Connection not available');
    }
}