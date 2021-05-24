import mongoose, {Schema} from 'mongoose';

interface EnvAttrs {
    name: string;
    description: string;
    order: number;
    isPublic: boolean;
    supportedDomains: string[];

    applicationName: string;
    clientUserName: string;

    createdAt?: Date;
    createdBy: string;
    updatedBy: string;
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

    applicationName: string;
    clientUserName: string;

    createdAt?: Date;
    createdBy: string;
    updatedBy: string;
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

        updatedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        updatedAt : { type: Date },

        createdBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        createdAt : { type: Date },
    }
);

SchemaInstance.statics.build = (attrs: EnvAttrs) => {
    return new EnvModel(attrs);
};

const EnvModel = mongoose.model<EnvDoc, EnvType>('Env', SchemaInstance);

export { EnvModel };
