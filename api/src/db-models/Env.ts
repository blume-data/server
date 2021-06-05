import mongoose, {Schema} from 'mongoose';

interface EnvAttrs {
    name: string;
    description: string;
    order: number;
    isPublic: boolean;
    supportedDomains: string[];

    applicationName: string;
    clientUserName: string;
    id: string;

    createdAt?: Date;
    createdById: string;
    updatedById: string;
    updatedAt?: Date;
}

interface EnvType extends mongoose.Model<EnvDoc> {
    build(attrs: EnvAttrs): EnvDoc;
}

interface EnvDoc extends mongoose.Document {

    name: string;
    description: string;
    order: number;
    isPublic: boolean;
    supportedDomains: string[];
    id: string;
    applicationName: string;
    clientUserName: string;

    createdAt?: Date;
    createdById: string;
    updatedById: string;
    updatedAt?: Date;
}

const SchemaInstance = new mongoose.Schema(
    {
        name: String,
        description: String,
        order: Number,
        
        isPublic: {
            type: Boolean,
            default: false
        },
        supportedDomains: {
            name: {
                type: String
            }
        },

        applicationName: String,
        clientUserName: String,
        id: String,
        updatedById : String,
        updatedAt : { type: Date },

        createdById : String,
        createdAt : { type: Date },
    },
    { 
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

SchemaInstance.virtual('createdBy', {
    ref: 'ClientUser', // The model to use
    localField: 'createdById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

SchemaInstance.virtual('updatedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'updatedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

SchemaInstance.virtual('deletedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'deletedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

SchemaInstance.statics.build = (attrs: EnvAttrs) => {
    return new EnvModel(attrs);
};

const EnvModel = mongoose.model<EnvDoc, EnvType>('Env', SchemaInstance);

export { EnvModel };
