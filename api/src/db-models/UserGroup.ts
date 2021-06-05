import mongoose, { Schema } from 'mongoose';

interface UserGroupAttrs {

    clientUserName: string;
    applicationName: string;
    env: string;
    name: string;
    description: string;
    id: string;

    createdAt: Date;
    createdById: string;
    updatedAt: Date;
    updatedById: string;
}

interface UserGroupModelType extends mongoose.Model<UserGroupDoc> {
    build(attrs: UserGroupAttrs): UserGroupDoc;
}

interface UserGroupDoc extends mongoose.Document {
    
    clientUserName: string;
    applicationName: string;
    env: string;
    name: string;
    description: string;
    id: string;
    
    createdAt: Date;
    createdById: string;
    updatedAt: Date;
    updatedById: string;
}

const UserGroupSchema = new mongoose.Schema(
    {
        
        env: String,
        name: {
            type: String,
            required: true
        },
        clientUserName: String,
        applicationName: String,
        description: String,
        id: String,
        updatedAt : { type: Date },
        updatedById : String,
        createdAt : { type: Date },
        createdById : String
    },
    { 
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

UserGroupSchema.virtual('createdBy', {
    ref: 'ClientUser', // The model to use
    localField: 'createdById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

UserGroupSchema.virtual('updatedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'updatedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

UserGroupSchema.virtual('deletedBy', {
    ref: 'ClientUser', // The model to use
    localField: 'deletedById', // Find people where `localField`
    foreignField: 'id', // is equal to `foreignField`
    justOne: true,
});

UserGroupSchema.statics.build = (attrs: UserGroupAttrs) => {
    return new UserGroupModel(attrs);
};

const UserGroupModel = mongoose.model<UserGroupDoc, UserGroupModelType>('UserGroupModel', UserGroupSchema);

export { UserGroupModel };