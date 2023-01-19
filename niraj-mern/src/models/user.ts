import mongoose from 'mongoose';
import { Password } from '../services/password';

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
};

// interface that describes the properties that user document has
export type UserDocument = mongoose.Document & UserAttrs;

type BuildFn = (attrs: UserAttrs) => UserDocument;
// interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDocument> {
  build: BuildFn;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
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

userSchema.pre('save', async function (next) {
  // here 'this' is document
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  next();
});

userSchema.statics.build = function (attrs: UserAttrs) {
  // here this is userModel
  // after building this document in the model, it should be saved()
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User, type UserSerialized };
