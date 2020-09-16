import {RanjodhbirSchema} from "./index";
import {Data} from "./data";
import {randomNumber} from "../utils/methods";
import {RANDOM_STRING} from "@ranjodhbirkaur/common";
import * as fs from "fs";

interface ReadDataType {
    pageNo?: number;
    perPage?: number;
    where?: any | null;
    getOnly?: string[] | null;
}

export class RanjodhbirModel extends RanjodhbirSchema {

    constructor(name: string, clientUserName: string, connectionName: string) {
        super(name, clientUserName, connectionName);
    }

    private async waitToStore(item: object) {
        return new Promise((resolve, reject) => {
            fs.readdir(`${this.getModelPath()}`, (err, files) => {

                const tasks = files.filter(file => {
                    const fileName = file.split('.');
                    if (fileName.length && fileName[0].length !== 1) {
                        return file;
                    }
                });

                let smallest = new Date().getTime();
                files.forEach(file => {
                    const fileName = file.split('.');
                    if (fileName.length && fileName[0].length !== 1) {
                        if (smallest < Number(fileName[0])) {
                            smallest = Number(fileName[0]);
                        }
                    }
                });
            });
        });
    }

    private async addTask(item: object) {
        const date = new Date();
        const time = date.getTime();
        await this.writeFile(JSON.stringify(item), `${time}.txt`);
    }

    private async checkIsModelWritable(): Promise<boolean> {
        return new Promise(async (resolve) => {
            const res = await this.getMetaData();
            if (res && !res.isUnderWrite) {
                await this.setWritable(true);
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    }

    async mutateData(item: object) {
        // check if this model is not under write mode
        const isWritable = await this.checkIsModelWritable();
        if (isWritable) {
            await this.storeData(item);
        }
        else {
            await this.addTask(item);
        }
    }

    async storeData(item: object) {
        const containerNumber = randomNumber(10);
        // ids first number is container number
        const id = `${containerNumber}${RANDOM_STRING(10)}`;
        const containerData = await this.readFile(`${containerNumber}.txt`);

        if (containerData !== undefined && typeof containerData === 'string') {
            const parsedData = JSON.parse(containerData);
            const newData = new Data(id);
            const data = Object.assign(item, newData);
            parsedData.push(data);
            await this.writeFile(JSON.stringify(parsedData), `${containerNumber}.txt`);
        }
    }

    async readData(conditions: ReadDataType) {

        const {pageNo=1, perPage=10, getOnly=null, where=null} = conditions;
        let data: any = [];
        let count = 0;
        const readFile = this.readFile.bind(this);
        let isFull = false;

        function pushData(item: any) {
            if (getOnly && getOnly.length) {
                const dataItem: any = {};
                getOnly.forEach((getOnlyItem: string) => {
                    dataItem[getOnlyItem] = item[getOnlyItem] || null;
                });
                data.push(dataItem);
            }
            else {
                data.push(item);
            }
            count++;
            if (count == (pageNo * perPage)) {
                isFull = true;
            }
        }

        function whereCondition(item: any) {
            let isConditionSatisfied = true;
            for (let condition in where) {
                if (where.hasOwnProperty(condition) && item[condition] !== where[condition]) {
                    isConditionSatisfied = false;
                }
            }
            if(isConditionSatisfied) {
                // If condition matches
                pushData(item);
            }
        }

        async function iterateFile() {
            for(let index=0; index <= 9; index++) {
                const content = await readFile(`${index}.txt`);
                if (typeof content === "string") {
                    const parsedContent = JSON.parse(content);
                    parsedContent.map((item: any) => {
                        if (!isFull) {
                            if (item && data.length<=perPage) {
                                if (data.length === perPage) {
                                    // empty the data
                                    data = [];
                                    pushData(item);
                                }
                                else {
                                    // If there is where condition
                                    if (where && typeof where === 'object') {
                                        whereCondition(item);
                                    }
                                    // There is no where condition
                                    else {
                                        pushData(item);
                                    }
                                }
                            }
                        }
                    });
                }
            }
            return data;
        }
        return await iterateFile();
    }
}