import {RanjodhbirSchema, RuleType} from "./index";
import {Data} from "./data";
import * as fs from "fs";

export class RanjodhbirModel extends RanjodhbirSchema {

    constructor(name: string, schema: RuleType[]) {
        super(name, schema);
    }

    async storeData(item: object) {
        const metaData = await this.readMetaFile();
        console.log('metadata', metaData);
        if (metaData && typeof metaData === 'string') {
            const meta = JSON.parse(metaData);
            const id = meta.numberOfRecords + 1;
            const newData = new Data(id);
            const data = JSON.stringify(Object.assign(item, newData));

            await this.writeFile(data, `${id}.txt`);
            await this.updateMetaData(meta, {numberOfRecords: id});
        }
    }

    async readData(skip=0, limit=10, perPage=10) {
        const data: any = [];
        return new Promise((resolve, reject) => {
            fs.readdir(`${this.getModelPath()}`, async (err, files) => {
                if (err) reject(err);
                files.forEach((file, index) => {
                    if (data.length <= perPage) {
                        const content = this.readFile(file);
                        data.push(content);
                    }

                });
                const values = await Promise.all(data);
                const items = values.map((value: any) => {
                    return JSON.parse(value);
                });
                resolve(items);
            });
        });
    }
}