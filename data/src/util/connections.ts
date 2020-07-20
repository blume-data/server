import * as mongoose from "mongoose";
import {MONGO_DB_DATA_CONNECTIONS_AVAILABLE} from "./constants";
import {Connection} from "mongoose";

const availableConnection: {name: string, dbConnection: Connection}[] = [];

/*Invoke this method on init*/
const initClientDbConnection = () => {

    MONGO_DB_DATA_CONNECTIONS_AVAILABLE.forEach(connectionName => {
        const dbConnection = mongoose.createConnection(`mongodb://data-mongo-${connectionName}-srv/${connectionName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        dbConnection.db.once("open", function() {
            availableConnection.push({
                name: connectionName,
                dbConnection
            });
        });
    });
};

export function getConnection(name: string) {
    const exist = availableConnection.find(item => item.name === name);
    if (exist) {
        return exist;
    }
    else {
        throw new Error('Connection not available');
    }
}