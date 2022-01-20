import mongoose, {Schema} from 'mongoose';
interface ApplicationSpaceAttrs {

    name: string;
    clientUserName: string;
    description: string;
    envId: string[];
    id: string;
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
    envId: string[];
    id: string;
    // created
    createdById: string;
    createdAt?: Date;

    // deleted
    deletedById?: string;
    deletedAt?: Date;

    // updated
    updatedById: string;
    updatedAt?: Date;
}

const ApplicationSpaceMModel = new mongoose.Schema({

        name: String,
        description: String,
        clientUserName : String,
        id: String,
        env: [{type: String}],

        deletedById : String,
        deletedAt : { type: Date },

        createdById : String,
        createdAt : { type: Date },

        updatedById : String,
        updatedAt : { type: Date },
    }, { 
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

ApplicationSpaceMModel.virtual('env', {
    ref: 'Env', // The model to use
    localField: 'env', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
});

ApplicationSpaceMModel.virtual('createdBy', {
    ref: 'ClientUser', // The model to use
    localField: 'createdById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

ApplicationSpaceMModel.virtual('updatedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'updatedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

ApplicationSpaceMModel.virtual('deletedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'deletedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

ApplicationSpaceMModel.statics.build = (attrs: ApplicationSpaceAttrs) => {
    return new ApplicationSpaceModel(attrs);
};

const ApplicationSpaceModel = mongoose.model<ApplicationSpaceDoc, ApplicationSpace>('ApplicationSpace', ApplicationSpaceMModel);

export { ApplicationSpaceModel };
