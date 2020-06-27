import mongoose from 'mongoose';
import { Password } from '../services/password';

interface TempUserAttrs {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    verificationToken: string,
    userName: string;
    role: string;
}

interface TempUserModel extends mongoose.Model<TempUserDoc> {
    build(attrs: TempUserAttrs): TempUserDoc;
}

interface TempUserDoc extends mongoose.Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    verificationToken: string,
    userName: string;
    role: string;
    created_at: string;
}

const tempUserSchema = new mongoose.Schema(
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

tempUserSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));

        this.set('password', hashed);
    }
    done();
});

tempUserSchema.statics.build = (attrs: TempUserAttrs) => {
    return new TempUser(attrs);
};

const TempUser = mongoose.model<TempUserDoc, TempUserModel>('TempUser', tempUserSchema);

export { TempUser };
