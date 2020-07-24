import mongoose from 'mongoose';
import { Password } from '../services/password';

interface AdminUserAttrs {
  email?: string;
  userName?: string;
  password: string;
  isEnabled?: boolean;
}

interface AdminUserModel extends mongoose.Model<AdminUserDoc> {
  build(attrs: AdminUserAttrs): AdminUserDoc;
}

interface AdminUserDoc extends mongoose.Document {
    email?: string;
    userName?: string;
    password: string;
    isEnabled?: boolean;
}

const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String
    },
    userName: {
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

adminUserSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

adminUserSchema.statics.build = (attrs: AdminUserAttrs) => {
  return new AdminUser(attrs);
};

const AdminUser = mongoose.model<AdminUserDoc, AdminUserModel>('AdminUser', adminUserSchema);

export { AdminUser };
