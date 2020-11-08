import {RanjodhbirSchema} from "./index";
import {Data} from "./data";
import {RANDOM_STRING} from "@ranjodhbirkaur/common";

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

    constructor(name: string, clientUserName: string, applicationName: string) {
        super(name, clientUserName, applicationName);
    }

    /*
    * Check if the model is writable then store data
    * */
    async mutateData(params: MutateType) {
        await this.storeData(params.item);
    }

    /*
    * Write data to actual file
    * */
    async storeData(item: object) {
        const id = `${RANDOM_STRING(10)}`;
        const newData = new Data(id);
        const data = Object.assign(item, newData);

        await this.writeFile(JSON.stringify(data)+'\n', `${0}.txt`);
    }

    async readData(conditions: ReadDataType) {

        const {skip=0, limit=10, getOnly=null, where=null} = conditions;
        let data: any = [];
        let count = 0;
        let skipped = 0;
        const rootPath = this.getModelPath();
        let isCollectionCompleted = false;

        function pushData(item: any) {
            if(skipped < skip) {
                skipped++;
            }
            else {
                // skip space application language property
                let dataObject: any = {};
                for(let propertyItem in item) {
                    if(item.hasOwnProperty(propertyItem)) {
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
                    if (item) {
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
                console.log('reading flole')
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