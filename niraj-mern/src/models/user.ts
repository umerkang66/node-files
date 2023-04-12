import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';
import { Password } from '../services/password';

// interface to describe the properties that are required to create user
interface UserAttrs {
  name: string;
  email: string;
  password: string;
}
// This type will be returned to the frontend
type UserSerialized = Omit<UserAttrs, 'password'> & {
  id: string;
  // these are actually 'dates'
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
  isVerified: boolean;
  role: 'user' | 'admin';
};

@pre<UserClass>('save', async function (next) {
  if (!this.isModified('password') || this.isNew) {
    // if the password is not modified
    // or if the password is modified, but the document is new, it is created first time
    // don't do anything
    return next();
  }
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
})
@pre<UserClass>('save', async function () {
  // here 'this' is document
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
})
@modelOptions({
  schemaOptions: {
    collection: 'users',
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
  },
})
class UserClass {
  @prop({ required: true, trim: true })
  name: string;

  @prop({ required: true, trim: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: false })
  isVerified: boolean;

  @prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

  @prop()
  passwordChangedAt: Date;

  validatePassword(this: UserDocument, candidatePassword: string) {
    return Password.compare(candidatePassword, this.password);
  }

  passwordChangedAfter(this: UserDocument, jwtIssuedAt: number): boolean {
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
  }

  static build(attrs: UserAttrs): UserDocument {
    // here this is userModel
    // after building this document in the model, it should be saved()
    return new User(attrs);
  }
}

const User = getModelForClass(UserClass);
type UserDocument = DocumentType<UserClass>;

// UserClass is exported because of the db references
export { UserClass, User, type UserDocument, type UserSerialized };
