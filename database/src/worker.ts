import {TasksAttrs, TasksModel} from "./models/tasks";
import {RanjodhbirModel} from "./ranjodhbirDb/model";
import events from "events";
import {DataBaseModelsModel} from "./models/models";
import {START_TASK} from "./utils/constants";

export const eventEmitter = new events.EventEmitter();

async function completeTasks(tasks: TasksAttrs[], modelName: string, clientUserName: string) {

    if (tasks && tasks.length) {
        for(let i=0; i<tasks.length;i++) {
            const {modelName, clientUserName, containerName, query, action, applicationName} = tasks[i];
            const newModel = new RanjodhbirModel(modelName, clientUserName, containerName, applicationName);
            switch (action) {
                case "post": {
                    await newModel.storeData(JSON.parse(query));
                    await TasksModel.deleteOne({modelName, clientUserName, containerName, action});
                    break;
                }
            }
        }
        const anyMoreTasks = await getTasks(modelName, clientUserName);
        if (anyMoreTasks) {
            await completeTasks(anyMoreTasks, modelName, clientUserName);
        }
        else {
            await setWritable(tasks[0].clientUserName, tasks[0].modelName, true);
        }
    }
}

async function getTasks(modelName: string, clientUserName: string) {
    return TasksModel.find({clientUserName, modelName}).limit(1000).sort('created_at');
}

export async function setWritable(clientUserName: string, modelName: string, isWritable: boolean) {
    await DataBaseModelsModel.updateOne({
        clientUserName,
        modelName,
    }, {isWritable});
}

async function startTask(modelName: string, clientUserName: string) {
    const tasks = await getTasks(modelName, clientUserName);
    if (tasks.length) {
        await completeTasks(tasks, modelName, clientUserName);
    }
}

console.log('Started database task worker');

eventEmitter.on(START_TASK, async (modelName: string, clientUserName: string) => {
    await startTask(modelName, clientUserName);
});
