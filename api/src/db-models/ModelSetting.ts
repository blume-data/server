import mongoose from 'mongoose';

interface SettingModelAttrs {

    isPublic: boolean;
    supportedDomains?: string;

    getRestrictedUserGroupIds?: string[];
    postRestrictedUserGroupIds?: string[];
    putRestrictedUserGroupIds?: string[];
    deleteRestrictedUserGroupIds?: string[];
    
    getPermittedUserGroupIds?: string[];
    postPermittedUserGroupIds?: string[];
    putPermittedUserGroupIds?: string[];
    deletePermittedUserGroupIds?: string[];

    id: string;
    isEnabled: boolean;
    // updated
    updatedById: string;
    updatedAt?: Date;
}

interface SettingModel extends mongoose.Model<SettingDoc> {
    build(attrs: SettingModelAttrs): SettingDoc;
}

interface SettingDoc extends mongoose.Document {

    isPublic: boolean;
    isEnabled: boolean;
    supportedDomains: string;
    
    getRestrictedUserGroupIds?: string[];
    postRestrictedUserGroupIds?: string[];
    putRestrictedUserGroupIds?: string[];
    deleteRestrictedUserGroupIds?: string[];
    
    getPermittedUserGroupIds?: string[];
    postPermittedUserGroupIds?: string[];
    putPermittedUserGroupIds?: string[];
    deletePermittedUserGroupIds?: string[];

    id: string;
    updatedById: string;
    updatedAt: Date;
}

const Setting = new mongoose.Schema(
    {
        isPublic: {
            type: Boolean,
            default: false
        },
        isEnabled: {
            type: Boolean,
            default: false
        },
        supportedDomains: String,
        
        getRestrictedUserGroupIds: [{ type: String}],
        postRestrictedUserGroupIds: [{ type: String}],
        putRestrictedUserGroupIds: [{ type: String}],
        deleteRestrictedUserGroupIds: [{ type: String}],
        
        getPermittedUserGroupIds: [{ type: String}],
        postPermittedUserGroupIds: [{ type: String}],
        putPermittedUserGroupIds: [{ type: String}],
        deletePermittedUserGroupIds: [{ type: String}],

        id: String,
        updatedById : String,
        updatedAt : { type: Date },
    },
    { 
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

Setting.virtual('restrictedUserGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'restrictedUserGroupIds', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
  });
Setting.virtual('permittedUserGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'permittedUserGroupIds', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
});

Setting.virtual('updatedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'updatedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

Setting.statics.build = (attrs: SettingModelAttrs) => {
    return new SettingModel(attrs);
};

const SettingModel = mongoose.model<SettingDoc, SettingModel>('SettingModel', Setting);

export { SettingModel };
