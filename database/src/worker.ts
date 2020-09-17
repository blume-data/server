import events from "events";
import fs from "fs";
import {ADD_TASK} from "./utils/constants";

export const emitter = new events.EventEmitter();

emitter.on(ADD_TASK, async function (data=[], path) {


    return new Promise(function(resolve, reject) {
        fs.writeFile(path, JSON.stringify(data), (err) => {
            if (err) reject(err);
            resolve(data);
        });
    });
});

emitter.emit('Add_Task');
