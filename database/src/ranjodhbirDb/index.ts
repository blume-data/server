import fs  from 'fs';
import {DataBaseModelsModel} from "../models/models";

export class RanjodhbirSchema {

    name: string;
    readonly clientUserName: string;
    readonly containerName: string;
    private readonly dataBaseDirectory: string;

    constructor(name: string, clientUserName: string, containerName: string, applicationName: string) {
        this.name = name;
        this.containerName = containerName;
        this.dataBaseDirectory = `database/${containerName}/${applicationName}`;
        this.clientUserName = clientUserName;
    }

    getModelPath(): string {
        return `${this.dataBaseDirectory}/${this.clientUserName}/${this.name}`;
    }

    async writeFile(data: string, fileName: string) {

        const path = `${this.getModelPath()}/${fileName}`;

        return new Promise(function(resolve, reject) {
            fs.appendFile(path, data, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async createSchema() {
        const path = this.getModelPath();
        return new Promise(async (resolve, reject) => {
            try {
                await fs.promises.access(path);
                // directory is already created
                resolve();
            } catch (error) {
                try {
                    fs.mkdir(path, { recursive: true }, async (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            const mongoModel = DataBaseModelsModel.build({
                                clientUserName: this.clientUserName,
                                modelName: this.name,
                                isWritable: true
                            });
                            await mongoModel.save();
                            resolve();
                        }
                    });
                }
                catch (e) {
                    reject(e);
                }
            }
        });
    }

    async readFile(fileName: string) {

        const path = this.getModelPath();

        return new Promise(function(resolve, reject) {

            fs.readFile(`${path}/${fileName}`,'utf8', function(err, data) {
                if (err) {
                    console.log('Error in reading data', err);
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
}