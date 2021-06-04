import mongoose, {Schema} from 'mongoose';

interface CollectionAttrs {
    clientUserName : string;
    applicationName: string;
    env: string;

    rules: string;
    name: string;
    description: string;
    displayName: string;
    isPublic: boolean;
    isEnabled?: boolean;
    metaData?: string;
    settingId?: string;
    titleField: string;
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

interface CollectionModel extends mongoose.Model<CollectionDoc> {
    build(attrs: CollectionAttrs): CollectionDoc;
}

interface CollectionDoc extends mongoose.Document {
    clientUserName : string;
    applicationName: string;
    env: string;
    id: string;
    rules: string;
    name: string;
    description: string;
    displayName: string;
    isPublic: boolean;
    isEnabled: boolean;
    metaData?: string;
    settingId?: string;
    titleField: string;

    createdById: string;
    createdAt?: Date;

    deletedById?: string;
    deletedAt?: Date;

    updatedById: string;
    updatedAt: Date;
}

const Collection = new mongoose.Schema(
    {
        clientUserName: {
            type: String,
            required: true
        },
        applicationName: {
            type: String,
            required: true
        },
        env: {
            type: String,
            required: true
        },
        rules : {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        displayName: {
            type: String,
            required: true
        },
        isPublic : {
            type: Boolean,
            default: false
        },
        isEnabled : {
            type: Boolean,
            default: true
        },
        metaData : {
            type: String
        },
        settingId: String,
        id: String,
        
        titleField: {type: String},

        deletedById : String,
        deletedAt : { type: Date },

        createdById : String,
        createdAt : { type: Date },

        updatedById : String,
        updatedAt : { type: Date },
    },
    { 
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

Collection.virtual('setting', {
    ref: 'SettingModel', // The model to use
    localField: 'settingId', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

Collection.virtual('createdBy', {
    ref: 'ClientUser', // The model to use
    localField: 'createdById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

Collection.virtual('updatedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'updatedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

Collection.virtual('deletedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'deletedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

Collection.statics.build = (attrs: CollectionAttrs) => {
    return new CollectionModel(attrs);
};

const CollectionModel = mongoose.model<CollectionDoc, CollectionModel>('CollectionModel', Collection);

export { CollectionModel };
