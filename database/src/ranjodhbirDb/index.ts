import fs  from 'fs';

export interface RuleType {
    name: string;
    type: 'string' | 'boolean' | 'number' | null;
    default?: 'string' | 'boolean' | 'number' | null;
    required?: false;
}

export interface MetaDataType {
    numberOfRecords: number;
    schema: RuleType[]
}

export class RanjodhbirSchema {

    name: string;
    private readonly clientUserName: string;
    schema: RuleType[] | [];
    private readonly dataBaseDirectory: string;
    private readonly metaFile: string;

    constructor(name: string, clientUserName: string, schema?: RuleType[] | []) {
        this.name = name;
        this.schema = schema ? schema : [];
        this.dataBaseDirectory = 'database';
        this.metaFile = 'meta.txt';
        this.clientUserName = clientUserName;
    }

    getMetaFileName() {
        return this.metaFile;
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
                            const metaData = {
                                numberOfRecords: 0,
                                schema: this.schema
                            };
                            for(let i=0;i<=9;i++) {
                                await this.writeFile(JSON.stringify([]), `${i}.txt`);
                            }
                            await this.writeFile(JSON.stringify(metaData), this.metaFile);
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

    async readMetaFile() {
        const metaFileName = this.getMetaFileName();

        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.readFile(metaFileName);
                resolve(data);
            }
            catch(error) {
                reject(error);
            }
        })
    }

    async updateMetaData(meta: MetaDataType, data: object) {
        await this.writeFile(JSON.stringify(Object.assign(meta, data)), this.getMetaFileName());
    }
}