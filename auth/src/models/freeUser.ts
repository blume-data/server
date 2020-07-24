import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are required to create a new User
interface FreeUserAttrs {
  email?: string;
  userName?: string;
  mainUserName: string;
  appName: string;
  env: string;
  password: string;
  isEnabled?: boolean;
}

// An interface that describes the properties
// that a User Model has
interface FreeUserModel extends mongoose.Model<FreeUserDoc> {
  build(attrs: FreeUserAttrs): FreeUserDoc;
}

// An interface that describes the properties
// that a User Document has
interface FreeUserDoc extends mongoose.Document {
  email?: string;
  userName?: string;
  mainUserName: string;
  appName: string;
  env: string;
  password: string;
  isEnabled?: boolean;
}

const freeUserSchema = new mongoose.Schema(
  {
    email: {
      type: String
    },
    userName: {
      type: String
    },
    mainUserName: {
      type: String,
      required: true
    },
    appName: {
      type: String,
      required: true
    },
    env: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    isEnabled : {
    type: Boolean,
    default: true
    },
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
