import fs  from 'fs';

interface MetaDataType {
    isUnderWrite: boolean;
    tasks: [];
}

export class RanjodhbirSchema {

    name: string;
    private readonly clientUserName: string;
    private readonly dataBaseDirectory: string;
    private readonly metaFileName: string;

    constructor(name: string, clientUserName: string, connectionName: string) {
        this.name = name;
        this.dataBaseDirectory = `database/${connectionName}`;
        this.clientUserName = clientUserName;
        this.metaFileName = 'meta.txt';
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
                            const metaData: MetaDataType = {
                                isUnderWrite: false,
                                tasks: []
                            };
                            await this.writeFile(JSON.stringify(metaData), this.metaFileName);
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

    async getMetaData(): Promise<MetaDataType | null> {
        const metaData = await this.readFile(this.metaFileName);
        if (metaData && typeof metaData === 'string') {
            return JSON.parse(metaData);
        }
        return null;
    }

    async setWritable(status: boolean) {
        const metaData = await this.getMetaData();
        if (metaData) {
            metaData.isUnderWrite = status;
            await this.writeFile(JSON.stringify(metaData), this.metaFileName);
        }
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