import mongoose from 'mongoose';
import { Password } from '../services/password';
import {getRootUserSchema, RootUserAttrs, RootUserDoc} from "./adminUser";

// An interface that describes the properties
// that are required to create a new User
interface FreeUserAttrs extends RootUserAttrs{
  email?: string;
  clientUserName: string;
  applicationName?: string;
  env?: string;
  clientType: string;
}

// An interface that describes the properties
// that a User Model has
interface FreeUserModel extends mongoose.Model<FreeUserDoc> {
  build(attrs: FreeUserAttrs): FreeUserDoc;
}

// An interface that describes the properties
// that a User Document has
interface FreeUserDoc extends RootUserDoc {
  email?: string;
  clientUserName: string;
  applicationName: string;
  env: string;
  clientType: string;
}

const freeUserSchema = getRootUserSchema({
    email: {
        type: String
    },
    clientUserName: {
        type: String,
        required: true
    },
    applicationName: {
        type: String,
    },
    env: {
        type: String
    },
    clientType: {
        type: String,
        required: true
    }
});

freeUserSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

freeUserSchema.statics.build = (attrs: FreeUserAttrs) => {
  return new FreeUser(attrs);
};

const FreeUser = mongoose.model<FreeUserDoc, FreeUserModel>('FreeUser', freeUserSchema);

export { FreeUser };
