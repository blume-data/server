import mongoose, {Schema} from 'mongoose';
import {
    BOOLEAN_FIElD_TYPE, DATE_AND_TIME_FIElD_TYPE, DATE_FIElD_TYPE,
    INTEGER_FIElD_TYPE, JSON_FIELD_TYPE, LOCATION_FIELD_TYPE,
    LONG_STRING_FIELD_TYPE, MEDIA_FIELD_TYPE, REFERENCE_FIELD_TYPE,
    SHORT_STRING_FIElD_TYPE
} from "@ranjodhbirkaur/constants";
import {TIMEZONE_DATE_CONSTANT} from "../util/constants";
import { REFFERENCE_ID_UNIQUE_NAME } from '../util/common-module';

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
        id: String,
        deletedById : String,
        deletedAt : { type: Date },

        createdById : String,
        createdAt : { type: Date },

        updatedById : String,
        updatedAt : { type: Date },
    };

    function addFields(fieldName: string, type: any, size=20) {
        for(let i=0; i<= size; i++) {
            schema[`${fieldName}${i}`] = type
        }
    }
    const ref = 'FileModel';

    addFields(SHORT_STRING_FIElD_TYPE, String, 40);
    addFields(INTEGER_FIElD_TYPE, Number);
    addFields(LONG_STRING_FIELD_TYPE, String);
    addFields(BOOLEAN_FIElD_TYPE, Boolean);
    addFields(LOCATION_FIELD_TYPE, String);
    addFields(JSON_FIELD_TYPE, Object);
    addFields(MEDIA_FIELD_TYPE, [{type: Schema.Types.ObjectId, ref}]);
    addFields(`${REFERENCE_FIELD_TYPE}${REFFERENCE_ID_UNIQUE_NAME}`, [{type: String}], 40);
    addFields(DATE_FIElD_TYPE, Date);
    addFields(DATE_AND_TIME_FIElD_TYPE, Date);
    addFields(`${DATE_AND_TIME_FIElD_TYPE}-${TIMEZONE_DATE_CONSTANT}`, String);
    return schema;
}

function configureVirtual(schma: Schema) {
    for(let i=0; i<= 40; i++) {
        CustomCollection.virtual(`${REFERENCE_FIELD_TYPE}${i}`, {
            ref: 'CustomCollectionModel',
            localField: `${REFERENCE_FIELD_TYPE}${REFFERENCE_ID_UNIQUE_NAME}${i}`,
            foreignField: 'id',
            justOne: false,
        });
    }

}

const CustomCollection = new mongoose.Schema(generateSchema(), { 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

configureVirtual(CustomCollection);

CustomCollection.virtual('createdBy', {
    ref: 'ClientUser', // The model to use
    localField: 'createdById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

CustomCollection.virtual('updatedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'updatedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

CustomCollection.virtual('deletedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'deletedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

const CustomCollectionModel = mongoose.model('CustomCollectionModel', CustomCollection);

export { CustomCollectionModel };
