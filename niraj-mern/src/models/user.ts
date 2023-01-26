import mongoose from 'mongoose';
import { Password } from '../services/password';
import {
  EmailVerifyToken,
  EmailVerifyTokenDocument,
} from './tokens/email-verify-token';
import {
  ResetPasswordToken,
  ResetPasswordTokenDocument,
} from './tokens/reset-password-token';

// interface to describe the properties that are required to create user
interface UserAttrs {
  name: string;
  email: string;
  password: string;
}

// This type will be returned to the frontend
type UserSerialized = Omit<UserAttrs, 'password'> & {
  // these are actually 'dates'
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
};

// interface that describes the properties that user document has
interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  addEmailVerifyToken: (token: string) => Promise<void>;
  checkEmailVerifyToken: (
    token: string
  ) => Promise<EmailVerifyTokenDocument | null>;
  addResetPasswordToken: (token: string) => Promise<void>;
  checkResetPasswordToken: (
    token: string
  ) => Promise<ResetPasswordTokenDocument | null>;
}

// interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDocument> {
  build: (attrs: UserAttrs) => UserDocument;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      // whenever JSON.stringify() will be called on document, this object will use this configs
      transform(doc, ret) {
        // after converting into plain obj, the object that is returned is "ret", we can modify that ret, it doesn't change the document in mongodb, but rather when it is turned into JSON by express
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

// MIDDLEWARES
userSchema.pre('save', async function (next) {
  // here 'this' is document
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  next();
});

// STATIC METHODS
userSchema.statics.build = function (attrs: UserAttrs): UserDocument {
  // here this is userModel
  // after building this document in the model, it should be saved()
  return new User(attrs);
};

// DOCUMENT METHODS
userSchema.methods.addEmailVerifyToken = async function (
  this: UserDocument,
  token: string
): Promise<void> {
  await EmailVerifyToken.build({ token, owner: this.id }).save();
};

userSchema.methods.checkEmailVerifyToken = async function (
  this: UserDocument,
  token: string
): Promise<EmailVerifyTokenDocument | null> {
  const foundToken = await EmailVerifyToken.findOne({
    token: Password.hashToken(token),
    owner: this.id,
  });

  return foundToken;
};

userSchema.methods.addResetPasswordToken = async function (
  this: UserDocument,
  token: string
): Promise<void> {
  await ResetPasswordToken.build({ owner: this.id, token }).save();
};

userSchema.methods.checkResetPasswordToken = async function (
  this: UserDocument,
  token: string
): Promise<ResetPasswordTokenDocument | null> {
  const foundToken = await ResetPasswordToken.findOne({
    owner: this.id,
    token: Password.hashToken(token),
  });

  return foundToken;
};

// MODEL
const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User, type UserSerialized, type UserDocument };
