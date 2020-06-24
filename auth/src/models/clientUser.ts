import mongoose from 'mongoose';
import { Password } from '../services/password';

interface ClientUserAttrs {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userName: string;
    isVerified: boolean;
    role: string;
}

interface ClientUserModel extends mongoose.Model<ClientUserDoc> {
    build(attrs: ClientUserAttrs): ClientUserDoc;
}

interface ClientUserDoc extends mongoose.Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userName: string;
    isVerified: boolean;
    role: string;
    created_at: string;
}

const clientUserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique:true,
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
        lastName : {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        isVerified : {
            type: Boolean,
            required: true
        },
        role : {
            type: String,
            required: true
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

export { ClientUser };
