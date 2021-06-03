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

interface CollectionModel extends mongoose.Model<CollectionDoc> {
    build(attrs: CollectionAttrs): CollectionDoc;
}

interface CollectionDoc extends mongoose.Document {
    clientUserName : string;
    applicationName: string;
    env: string;

    rules: string;
    name: string;
    description: string;
    displayName: string;
    isPublic: boolean;
    isEnabled: boolean;
    metaData?: string;
    settingId?: string;
    titleField: string;

    createdBy: string;
    createdAt?: Date;

    deletedBy?: string;
    deletedAt?: Date;

    updatedBy: string;
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
        
        titleField: {type: String},

        deletedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        deletedAt : { type: Date },

        createdBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        createdAt : { type: Date },

        updatedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
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

Collection.statics.build = (attrs: CollectionAttrs) => {
    return new CollectionModel(attrs);
};

const CollectionModel = mongoose.model<CollectionDoc, CollectionModel>('CollectionModel', Collection);

export { CollectionModel };
