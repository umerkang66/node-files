import mongoose from 'mongoose';
import { Password } from '../services/password';
import {
  AdminVerifyToken,
  AdminVerifyTokenDocument,
} from './tokens/admin-verify-token';
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
type Role = 'user' | 'admin';
// This type will be returned to the frontend
type UserSerialized = Omit<UserAttrs, 'password'> & {
  // these are actually 'dates'
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
  isVerified: boolean;
  role: Role;
};

// interface that describes the properties that user document has
interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
  isVerified: boolean;
  role: Role;
  passwordChangedAt: string | number | Date;
  addEmailVerifyToken: () => Promise<string>;
  checkEmailVerifyToken: (
    token: string
  ) => Promise<EmailVerifyTokenDocument | null>;
  addResetPasswordToken: () => Promise<string>;
  checkResetPasswordToken: (
    token: string
  ) => Promise<ResetPasswordTokenDocument | null>;
  validatePassword: (candidatePassword: string) => Promise<boolean>;
  passwordChangedAfter: (jwtIssuedAt: number) => boolean;
  addAdminVerifyToken: () => Promise<string>;
  checkAdminVerifyToken: (
    token: string
  ) => Promise<AdminVerifyTokenDocument | null>;
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
    role: {
      type: String,
      default: 'user',
      enum: { values: ['user', 'admin'] },
    },
    passwordChangedAt: { type: Date },
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
        delete ret.passwordChangedAt;
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) {
    // if the password is not modified
    // or if the password is modified, but the document is new, it is created first time
    // don't do anything
    return next();
  }

  this.passwordChangedAt = new Date(Date.now() - 1000);

  next();
});

// STATIC METHODS
userSchema.statics.build = function (attrs: UserAttrs): UserDocument {
  // here this is userModel
  // after building this document in the model, it should be saved()
  return new User(attrs);
};

// DOCUMENT METHODS
userSchema.methods.validatePassword = async function (
  this: UserDocument,
  candidatePassword: string
) {
  return await Password.compare(candidatePassword, this.password);
};

userSchema.methods.passwordChangedAfter = function (
  jwtIssuedAt: number
): boolean {
  // jwtIssuedAt is in seconds
  // here "this" is document
  if (this.passwordChangedAt) {
    // it means password has been changed, now we have to check, if password is changed after the jwt issued at, then passwordChangedAt will be greater than jwtTime, and return true.

    // converting milliseconds into seconds
    const changedTimestamp = parseInt(
      String(this.passwordChangedAt.getTime() / 1000),
      10
    );

    return changedTimestamp >= jwtIssuedAt;
  }
  return false;
};

userSchema.methods.addEmailVerifyToken = async function (
  this: UserDocument
): Promise<string> {
  // this will create a 8 digit token
  const token = Password.createToken(4);

  await EmailVerifyToken.build({ token, owner: this.id }).save();

  return token;
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
  this: UserDocument
): Promise<string> {
  const token = Password.createToken();

  await ResetPasswordToken.build({ owner: this.id, token }).save();

  return token;
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

userSchema.methods.addAdminVerifyToken = async function (
  this: UserDocument
): Promise<string> {
  // this will create a 8 digit token
  const token = Password.createToken(4);

  await AdminVerifyToken.build({ owner: this.id, token }).save();

  return token;
};

userSchema.methods.checkAdminVerifyToken = async function (
  this: UserDocument,
  token: string
): Promise<AdminVerifyTokenDocument | null> {
  const foundToken = await AdminVerifyToken.findOne({
    owner: this.id,
    token: Password.hashToken(token),
  });

  return foundToken;
};

// MODEL
const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User, type UserSerialized, type UserDocument };
