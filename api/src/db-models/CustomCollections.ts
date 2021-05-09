import mongoose, {Schema} from 'mongoose';
import {
    BOOLEAN_FIElD_TYPE, DATE_AND_TIME_FIElD_TYPE, DATE_FIElD_TYPE,
    INTEGER_FIElD_TYPE, JSON_FIELD_TYPE, LOCATION_FIELD_TYPE,
    LONG_STRING_FIELD_TYPE, MEDIA_FIELD_TYPE, REFERENCE_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE
} from "@ranjodhbirkaur/constants";

function generateSchema() {
    let schma: any =  {
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

        deletedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        deletedAt : { type: Date },

        createdBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        createdAt : { type: Date },

        updatedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        updatedAt : { type: Date },
    };

    function addFields(fieldName: string, type: any, size=20) {
        for(let i=0; i<= size; i++) {
            schma[`${fieldName}${i}`] = type
        }
    }
    const ref = 'FileModel';

    addFields(SHORT_STRING_FIElD_TYPE, String);
    addFields(INTEGER_FIElD_TYPE, Number);
    addFields(LONG_STRING_FIELD_TYPE, String, 5);
    addFields(BOOLEAN_FIElD_TYPE, Boolean);
    addFields(LOCATION_FIELD_TYPE, String);
    addFields(JSON_FIELD_TYPE, Object);
    addFields(MEDIA_FIELD_TYPE, [{ type: Schema.Types.ObjectId, ref}]);
    addFields(REFERENCE_FIELD_TYPE, String);
    addFields(DATE_FIElD_TYPE, Date);
    addFields(DATE_AND_TIME_FIElD_TYPE, Date);
    return schma;
}

/*interface CustomCollectionAttrs {

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
}*/

const CustomCollection = new mongoose.Schema(generateSchema());

const CustomCollectionModel = mongoose.model('CustomCollectionModel', CustomCollection);

export { CustomCollectionModel };
