import {TasksAttrs, TasksModel} from "./models/tasks";
import {RanjodhbirModel} from "./ranjodhbirDb/model";
import events from "events";
import {START_TASK} from "./utils/constants";

export const eventEmitter = new events.EventEmitter();

let isTasksRunning = false;

async function completeTasks(tasks: TasksAttrs[]) {

    if (tasks && tasks.length) {
        for(let i=0; i<tasks.length;i++) {
            const {modelName, clientUserName, connectionName, query, action} = tasks[i];
            const newModel = new RanjodhbirModel(modelName, clientUserName, connectionName);
            switch (action) {
                case "post": {
                    await newModel.storeData(JSON.parse(query));
                    break;
                }
            }
        }
    }
}

async function getTasks() {
    const tasks = await TasksModel.find({}).limit(1000).sort('created_at');
    if (!tasks.length) {
        isTasksRunning = false;
    }
    return tasks;
}

eventEmitter.on(START_TASK, async () => {
    if (!isTasksRunning) {
        const tasks = await getTasks();
        if (tasks.length) {
            isTasksRunning = true;
            await completeTasks(tasks);
        }
    }
});
