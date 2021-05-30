import mongoose, {Schema} from 'mongoose';

interface SettingModelAttrs {

    isPublic: boolean;
    supportedDomains: string[];
    restrictedUserGroups?: string[];
    permittedUserGroups?: string[];
    // updated
    updatedBy: string;
    updatedAt?: Date;
}

interface SettingModel extends mongoose.Model<SettingDoc> {
    build(attrs: SettingModelAttrs): SettingDoc;
}

interface SettingDoc extends mongoose.Document {

    isPublic: boolean;
    supportedDomains: string[];
    restrictedUserGroups?: string[];
    permittedUserGroups?: string[];

    updatedBy: string;
    updatedAt: Date;
}

const Setting = new mongoose.Schema(
    {
        isPublic: {
            type: Boolean,
            default: false
        },
        supportedDomains: {
            name: {
                type: String
            }
        },
        restrictedUserGroups: [{ type: Schema.Types.ObjectId, ref: 'UserGroupModel' }],
        permittedUserGroups: [{ type: Schema.Types.ObjectId, ref: 'UserGroupModel' }],

        updatedBy : { type: Schema.Types.ObjectId, ref: 'ClientUser' },
        updatedAt : { type: Date },
    }
);

Setting.statics.build = (attrs: SettingModelAttrs) => {
    return new SettingModel(attrs);
};

const SettingModel = mongoose.model<SettingDoc, SettingModel>('SettingModel', Setting);

export { SettingModel };
