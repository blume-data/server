import mongoose, {Schema} from 'mongoose';
import {
    BOOLEAN_FIElD_TYPE, DATE_AND_TIME_FIElD_TYPE, DATE_FIElD_TYPE,
    INTEGER_FIElD_TYPE, JSON_FIELD_TYPE, LOCATION_FIELD_TYPE,
    LONG_STRING_FIELD_TYPE, MEDIA_FIELD_TYPE, REFERENCE_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE
} from "@ranjodhbirkaur/constants";
import {TIMEZONE_DATE_CONSTANT} from "../util/constants";

function generateSchema() {

    let schema: any =  {
        name: {
            type: String,
            required: true
        },
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

        status: String,

        deletedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        deletedAt : { type: Date },

        createdBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        createdAt : { type: Date },

        updatedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        updatedAt : { type: Date },
    };

    function addFields(fieldName: string, type: any, size=20) {
        for(let i=0; i<= size; i++) {
            schema[`${fieldName}${i}`] = type
        }
    }
    const ref = 'FileModel';

    addFields(SHORT_STRING_FIElD_TYPE, String);
    addFields(INTEGER_FIElD_TYPE, Number);
    addFields(LONG_STRING_FIELD_TYPE, String, 5);
    addFields(BOOLEAN_FIElD_TYPE, Boolean);
    addFields(LOCATION_FIELD_TYPE, String);
    addFields(JSON_FIELD_TYPE, Object);
    addFields(MEDIA_FIELD_TYPE, [{type: Schema.Types.ObjectId, ref}]);
    addFields(REFERENCE_FIELD_TYPE, [{type: String}]);
    addFields(DATE_FIElD_TYPE, Date);
    addFields(DATE_AND_TIME_FIElD_TYPE, Date);
    addFields(`${DATE_AND_TIME_FIElD_TYPE}-${TIMEZONE_DATE_CONSTANT}`, String);
    return schema;
}

const CustomCollection = new mongoose.Schema(generateSchema());

const CustomCollectionModel = mongoose.model('CustomCollectionModel', CustomCollection);

export { CustomCollectionModel };
