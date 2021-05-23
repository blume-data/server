import mongoose, {Schema} from 'mongoose';

interface EnvType {
    name: string;
    description: string;
    order: number;
}

interface ApplicationSpaceAttrs {

    name: string;
    clientUserName: string;
    description: string;
    env: EnvType[];

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
    clientUserName: string;
    description: string;
    env: EnvType[];

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
        clientUserName : String,
        env: [{
            name: {type: String},
            description: {type: String},
            order: {type: Number}
        }],

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
