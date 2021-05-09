import mongoose, {Schema} from 'mongoose';

interface CustomCollectionAttrs {

    clientUserName : string;
    applicationName: string;
    env: string;

    data: string;
    _id_: string;

    // Can have six maximum comparable number fields
    comparable1?: string;
    comparable2?: string;
    comparable3?: string;
    comparable4?: string;
    comparable5?: string;
    comparable6?: string;
    comparable7?: string;
    comparable8?: string;
    comparable9?: string;
    comparable10?: string;

    // Can have six maximum searchable text fields
    searchable1?: string;
    searchable2?: string;
    searchable3?: string;
    searchable4?: string;
    searchable5?: string;
    searchable6?: string;
    searchable7?: string;
    searchable8?: string;
    searchable9?: string;
    searchable10?: string;

    // Can have six maximum date fields
    date1?: Date;
    date2?: Date;
    date3?: Date;
    date4?: Date;
    date5?: Date;
    date6?: Date;
    date7?: Date;
    date8?: Date;
    date9?: Date;
    date10?: Date;

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

interface CustomCollectionModel extends mongoose.Model<CustomCollectionDoc> {
    build(attrs: CustomCollectionAttrs): CustomCollectionDoc;
}

interface CustomCollectionDoc extends mongoose.Document {
    clientUserName : string;
    applicationName: string;
    env: string;

    data: string;
    _id_: string;

    // Can have six maximum comparable number fields
    comparable1?: string;
    comparable2?: string;
    comparable3?: string;
    comparable4?: string;
    comparable5?: string;
    comparable6?: string;
    comparable7?: string;
    comparable8?: string;
    comparable9?: string;
    comparable10?: string;

    // Can have six maximum searchable text fields
    searchable1?: string;
    searchable2?: string;
    searchable3?: string;
    searchable4?: string;
    searchable5?: string;
    searchable6?: string;
    searchable7?: string;
    searchable8?: string;
    searchable9?: string;
    searchable10?: string;

    // Can have six maximum date fields
    date1?: Date;
    date2?: Date;
    date3?: Date;
    date4?: Date;
    date5?: Date;
    date6?: Date;
    date7?: Date;
    date8?: Date;
    date9?: Date;
    date10?: Date;

    createdBy: string;
    createdAt?: Date;

    deletedBy?: string;
    deletedAt?: Date;

    updatedBy: string;
    updatedAt: Date;
}

const CustomCollection = new mongoose.Schema(
    {
        name: String,
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
        data : {
            type: String,
            required: true
        },
        _id_: {
            type: String,
            required: true
        },

        comparable1: Number,
        comparable2: Number,
        comparable3: Number,
        comparable4: Number,
        comparable5: Number,
        comparable6: Number,
        comparable7: Number,
        comparable8: Number,
        comparable9: Number,
        comparable10: Number,

        searchable1: String,
        searchable2: String,
        searchable3: String,
        searchable4: String,
        searchable5: String,
        searchable6: String,
        searchable7: String,
        searchable8: String,
        searchable9: String,
        searchable10: String,

        date1: { type: Date },
        date2: { type: Date },
        date3: { type: Date },
        date4: { type: Date },
        date5: { type: Date },
        date6: { type: Date },
        date7: { type: Date },
        date8: { type: Date },
        date9: { type: Date },
        date10: { type: Date },

        deletedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        deletedAt : { type: Date },

        createdBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        createdAt : { type: Date },

        updatedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        updatedAt : { type: Date },
    }
);

CustomCollection.statics.build = (attrs: CustomCollectionAttrs) => {
    return new CustomCollectionModel(attrs);
};

const CustomCollectionModel = mongoose.model<CustomCollectionDoc, CustomCollectionModel>('CustomCollectionModel', CustomCollection);

export { CustomCollectionModel };
