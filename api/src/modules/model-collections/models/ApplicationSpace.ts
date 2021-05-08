import mongoose, {Schema} from 'mongoose';

interface ApplicationSpaceAttrs {

    name: string;
    clientUserId: string;
    description: string;
    env: string[];
    hasQueryModel: boolean;

    // created
    createdBy: string;
    createdAt?: Date;

    // deleted
    deletedBy?: string;
    deletedAt?: Date;

    // updated
    updatedBy: string;
    updatedAt?: Date;
}

interface ApplicationSpace extends mongoose.Model<ApplicationSpaceDoc> {
    build(attrs: ApplicationSpaceAttrs): ApplicationSpaceDoc;
}

interface ApplicationSpaceDoc extends mongoose.Document {
    name: string;
    clientUserId: string;
    description: string;
    env: string[];
    hasQueryModel: boolean;

    // created
    createdBy: string;
    createdAt?: Date;

    // deleted
    deletedBy?: string;
    deletedAt?: Date;

    // updated
    updatedBy: string;
    updatedAt?: Date;
}

const ApplicationSpaceMModel = new mongoose.Schema({

        name: String,
        description: String,
        clientUserId : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        env: [{type: String}],
        hasQueryModel: {
            type: Boolean,
            default: false
        },

        deletedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        deletedAt : { type: Date },

        createdBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        createdAt : { type: Date },

        updatedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        updatedAt : { type: Date },
    });

ApplicationSpaceMModel.statics.build = (attrs: ApplicationSpaceAttrs) => {
    return new ApplicationSpaceModel(attrs);
};

const ApplicationSpaceModel = mongoose.model<ApplicationSpaceDoc, ApplicationSpace>('ApplicationSpace', ApplicationSpaceMModel);

export { ApplicationSpaceModel };
