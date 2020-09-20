import mongoose, {SchemaDefinition} from 'mongoose';
import {Password} from '../services/password';
import {supportUserType} from '@ranjodhbirkaur/common';

export interface RootUserAttrs {
    userName: string;
    jwtId: string;
    password: string;
    isEnabled?: boolean;
    created_at?: string;
}

export interface RootUserDoc extends mongoose.Document {
    userName: string;
    jwtId: string;
    password: string;
    isEnabled?: boolean;
    created_at: string;
}

export function getRootUserSchema(properties: SchemaDefinition) {
    return new mongoose.Schema(
        {
            ...properties,
            userName: {
                type: String,
                required: true
            },
            jwtId: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            isEnabled: {
                type: Boolean,
                default: true
            },
            created_at: {
                type: String,
                default: new Date()
            }
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
}

interface AdminUserAttrs extends RootUserAttrs{
  email: string;
  adminType: string
}

interface AdminUserModel extends mongoose.Model<AdminUserDoc> {
  build(attrs: AdminUserAttrs): AdminUserDoc;
}

interface AdminUserDoc extends RootUserDoc {
    email: string;
    adminType: string
}

const adminUserSchema = getRootUserSchema({
    email: {
        type: String,
        required: true
    },
    adminType: {
        type: String,
        default: supportUserType
    }
});

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
