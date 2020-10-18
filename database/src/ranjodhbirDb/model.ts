import {RanjodhbirSchema} from "./index";
import {Data} from "./data";
import {randomNumber} from "../utils/methods";
import {RANDOM_STRING} from "@ranjodhbirkaur/common";
import {DataBaseModelsModel} from "../models/models";
import {TasksModel} from "../models/tasks";
import {eventEmitter, setWritable} from "../worker";
import {NUMBER_OF_CONTAINERS, SPACE_APPLICATION_LANGUAGE, START_TASK} from "../utils/constants";
import fs from 'fs';
import es from 'event-stream';

interface ReadDataType {
    skip?: number;
    limit?: number;
    where?: any | null;
    getOnly?: string[] | null;
}

interface MutateType {
    action: 'put' | 'post' | 'delete',
    item: object
}

export class RanjodhbirModel extends RanjodhbirSchema {

    readonly language: string;

    constructor(name: string, clientUserName: string, containerName: string, applicationName: string, language: string) {
        super(name, clientUserName, containerName, applicationName);
        this.language = language;
    }

    private async addTask(params: MutateType) {
        const {action,item} = params;
        const task = TasksModel.build({
            clientUserName: this.clientUserName,
            modelName: this.name,
            containerName: this.containerName,
            applicationName: this.applicationName,
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
        const id = `${RANDOM_STRING(10)}`;
        const newData = new Data(id, this.language);
        const data = Object.assign(item, newData);

        await this.writeFile(JSON.stringify(data)+'\n', `${0}.txt`);
    }

    async readData(conditions: ReadDataType) {

        const {skip=0, limit=10, getOnly=null, where=null} = conditions;
        let data: any = [];
        let count = 0;
        let skipped = 0;
        const rootPath = this.getModelPath();
        const language = this.language;
        let isCollectionCompleted = false;

        function pushData(item: any) {
            if(skipped < skip) {
                skipped++;
            }
            else {
                // skip space application language property
                let dataObject: any = {};
                for(let propertyItem in item) {
                    if(item.hasOwnProperty(propertyItem) && propertyItem !== SPACE_APPLICATION_LANGUAGE) {
                        dataObject[propertyItem] = item[propertyItem];
                    }
                }
                data.push(dataObject);
                count++;
                if (count == limit && skip == skipped) {
                    isCollectionCompleted = true;
                }
            }
        }

        function processGetOnly(item: any) {
            if (getOnly && getOnly.length) {
                const dataItem: any = {};
                getOnly.forEach((getOnlyItem: string) => {
                    dataItem[getOnlyItem] = item[getOnlyItem] || null;
                });
                pushData(item);
            }
            else {
                pushData(item);
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
                processGetOnly(item);
            }
        }

        function processFileLine(content: string) {
            if (content && typeof content === "string") {
                try {
                    const item = JSON.parse(content);
                    // If the language matches
                    if (item && item[SPACE_APPLICATION_LANGUAGE] === language) {
                        // If there is where condition
                        if (where && typeof where === 'object') {
                            whereCondition(item);
                        }
                        // There is no where condition
                        else {
                            processGetOnly(item);
                        }
                    }
                }
                catch (e) {
                    //console.log('skipped htis', content)
                }
            }
        }

        async function bufferFile() {

            const path = `${rootPath}/${0}.txt`;

            return new Promise((resolve, reject) => {
                const s = fs
                    .createReadStream(path)
                    .pipe(es.split())
                    .pipe(es.mapSync(function(line: any){

                        console.log('still processing');

                        if(skipped <= skip && !isCollectionCompleted) {
                            s.pause();
                            processFileLine(line);
                            s.resume();
                        }
                        else {
                            s.destroy();
                            resolve();
                        }
                        })
                            .on('error', function(err){
                                console.log('Error while reading file.', err);
                            })
                            .on('end', function(){
                                console.log('Read entire file');
                                resolve();
                            })
                    );
            })

        }

        async function iterateFile() {
            await bufferFile();
            console.log('data length', data.length, skipped, skip);
            if(skip !== skipped) {
                return [];
            }
            return data;
        }

        return await iterateFile();
    }
}