import mongoose, { Connection } from 'mongoose';
import { Password } from '../services/password';
import {getRootUserSchema, RootUserAttrs, RootUserDoc} from "./adminUser";

interface ClientUserAttrs extends RootUserAttrs{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    applicationNames: string;
}

interface ClientUserModel extends mongoose.Model<ClientUserDoc> {
    build(attrs: ClientUserAttrs): ClientUserDoc;
}

interface ClientUserDoc extends RootUserDoc {
    email: string;
    firstName: string;
    lastName: string
    applicationNames: string;
}

const clientUserSchema = getRootUserSchema({
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase:true
    },
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    applicationNames : {
        type: String,
        required: true
    }
});

clientUserSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

clientUserSchema.statics.build = (attrs: ClientUserAttrs) => {
    return new ClientUser(attrs);
};

const ClientUser = mongoose.model<ClientUserDoc, ClientUserModel>('ClientUser', clientUserSchema);

export function getClientUserModel(connection: Connection) {
    return connection.model<ClientUserDoc, ClientUserModel>('ClientUser', clientUserSchema);

}

export { ClientUser };
