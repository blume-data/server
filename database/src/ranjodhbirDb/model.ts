import {RanjodhbirSchema} from "./index";
import {Data} from "./data";
import {randomNumber} from "../utils/methods";
import {RANDOM_STRING} from "@ranjodhbirkaur/common";
import {DataBaseModelsModel} from "../models/models";
import {TasksModel} from "../models/tasks";
import {eventEmitter, setWritable} from "../worker";
import {START_TASK} from "../utils/constants";

interface ReadDataType {
    pageNo?: number;
    perPage?: number;
    where?: any | null;
    getOnly?: string[] | null;
}

interface MutateType {
    action: 'put' | 'post' | 'delete',
    item: object
}

export class RanjodhbirModel extends RanjodhbirSchema {

    constructor(name: string, clientUserName: string, connectionName: string) {
        super(name, clientUserName, connectionName);
    }

    private async addTask(params: MutateType) {
        const {action,item} = params;
        const task = TasksModel.build({
            clientUserName: this.clientUserName,
            modelName: this.name,
            connectionName: this.connectionName,
            action,
            query: JSON.stringify(item)
        });
        await task.save();
    }

    private async checkIsModelWritable() {
        return DataBaseModelsModel.findOne({
            clientUserName: this.clientUserName,
            modelName: this.name
        }, 'isWritable');
    }

    /*
    * Check if the model is writable then store data
    * */
    async mutateData(params: MutateType) {
        const {action,item} = params;
        // check if this model is not under write mode
        const isWritable = await this.checkIsModelWritable();
        if (isWritable) {
            await setWritable(this.clientUserName, this.name, false);
            switch (action) {
                case "post": {
                    await this.storeData(item);
                    break;
                }
            }
        }
        else {
            await this.addTask({action, item});
        }
    }

    /*
    * Write data to actual file
    * */
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