import fs  from 'fs';

export class RanjodhbirSchema {

    name: string;
    readonly clientUserName: string;
    readonly connectionName: string;
    private readonly dataBaseDirectory: string;

    constructor(name: string, clientUserName: string, connectionName: string) {
        this.name = name;
        this.connectionName = connectionName;
        this.dataBaseDirectory = `database/${connectionName}`;
        this.clientUserName = clientUserName;
    }

    getModelPath(): string {
        return `${this.dataBaseDirectory}/${this.clientUserName}/${this.name}`;
    }

    async writeFile(data: string, fileName: string) {

        const path = `${this.getModelPath()}/${fileName}`;

        return new Promise(function(resolve, reject) {
            fs.writeFile(path, data, (err) => {
                if (err) reject(err);
                resolve(data);
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
                            // create a file
                            for(let i=0;i<=9;i++) {
                                await this.writeFile(JSON.stringify([]), `${i}.txt`);
                            }
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