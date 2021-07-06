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

  Setting.virtual('getRestrictedUserGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'getRestrictedUserGroupIds', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
  });

  Setting.virtual('postRestrictedUserGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'postRestrictedUserGroupIds', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
  });

  Setting.virtual('putRestrictedUserGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'putRestrictedUserGroupIds', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
  });

  Setting.virtual('deleteRestrictedUserGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'deleteRestrictedUserGroupIds', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
  });

Setting.virtual('getPermittedUserGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'getPermittedUserGroupIds', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
});

Setting.virtual('postPermittedUserGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'postPermittedUserGroupIds', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
});

Setting.virtual('putPermittedUserGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'putPermittedUserGroupIds', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: false,
});

Setting.virtual('deletePermittedUserGroups', {
    ref: 'UserGroupModel', // The model to use
    localField: 'deletePermittedUserGroupIds', // Find people where `localField`
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
