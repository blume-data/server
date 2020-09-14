import {RanjodhbirSchema, RuleType} from "./index";
import {Data} from "./data";
import {randomNumber} from "../utils/methods";
import {RANDOM_STRING} from "@ranjodhbirkaur/common";

interface ReadDataType {
    skip?: number;
    perPage?: number;
    where?: any | null;
    getOnly?: string[] | null;
}

export class RanjodhbirModel extends RanjodhbirSchema {

    constructor(name: string, clientUserName: string, schema?: RuleType[] | []) {
        super(name,clientUserName, schema ? schema : []);
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

        const {skip=0, perPage=10, getOnly=null, where=null} = conditions;
        let data: any = [];
        let count = 0;
        const readFile = this.readFile.bind(this);

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
                        if (item && data.length<=perPage) {
                            // If there is where condition
                            if (where && typeof where === 'object') {
                                whereCondition(item);
                            }
                            // There is no where condition
                            else {
                                pushData(item);
                            }
                        }
                        else {
                            // if the data is full
                            // check if its required to skip some content
                            if (count<=skip) {
                                // empty the data
                                data = [];
                            }
                        }
                    });
                }
            }
            return data;
        }

        /*return new Promise((resolve, reject) => {
            fs.readdir(`${this.getModelPath()}`, async (err, files) => {
                if (err) reject(err);
                else {
                    const response = await iterateFile();
                    resolve(response);
                    return;
                }
            });
        });*/
        return await iterateFile();
    }
}