import mongoose from 'mongoose';

interface TasksAttrs {
    modelName: string;
    clientUserName: string;
    query: string;
}

interface TasksModel extends mongoose.Model<TasksDoc> {
    build(attrs: TasksAttrs): TasksDoc;
}

interface TasksDoc extends mongoose.Document {
    modelName: string;
    clientUserName: string;
    query: string;
    created_at: string;
}

const Tasks = new mongoose.Schema(
    {
        modelName: {
            type: String,
            required: true
        },
        query: {
            type: String,
            required: true
        },
        clientUserName: {
            type: String,
            required: true
        },
        created_at : { type: Date, default: Date.now }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

Tasks.statics.build = (attrs: TasksAttrs) => {
    return new TasksModel(attrs);
};

const TasksModel = mongoose.model<TasksDoc, TasksModel>('TasksModel', Tasks);

export { TasksModel };
