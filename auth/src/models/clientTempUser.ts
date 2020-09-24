import mongoose from 'mongoose';
import { Password } from '../services/password';
import {supportUserType} from '@ranjodhbirkaur/common';

interface ClientTempUserAttrs {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    clientType: string;
    verificationToken: string,
    userName: string;
    clientUserName?: string;
    applicationName?: string;
}

interface ClientTempUserModel extends mongoose.Model<ClientTempUserDoc> {
    build(attrs: ClientTempUserAttrs): ClientTempUserDoc;
}

interface ClientTempUserDoc extends mongoose.Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    clientType: string;
    verificationToken: string,
    userName: string;
    created_at: string;
    clientUserName?: string;
    applicationName?: string;
}

const clientTempUserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase:true
        },
        password: {
            type: String,
            required: true
        },
        firstName : {
            type: String,
            required: true
        },
        verificationToken: {
            type: String,
            required: true
        },
        lastName : {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        clientUserName: {
            type: String
        },
        applicationName: {
            type: String
        },
        clientType: {
            type: String,
            default: supportUserType,
        },
        created_at : { type: Date, default: Date.now }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            }
        }
    }
);

clientTempUserSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));

        this.set('password', hashed);
    }
    done();
});

clientTempUserSchema.statics.build = (attrs: ClientTempUserAttrs) => {
    return new ClientTempUser(attrs);
};

const ClientTempUser = mongoose.model<ClientTempUserDoc, ClientTempUserModel>('ClientTempUser', clientTempUserSchema);

export { ClientTempUser };
