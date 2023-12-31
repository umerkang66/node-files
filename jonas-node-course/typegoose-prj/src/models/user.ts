import {
  DocumentType,
  ReturnModelType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { Post } from './post';

@modelOptions({
  schemaOptions: { _id: false },
})
class Job {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  company: string;
}

// '1' means ascending, and -1 means descending, in the case of search improvement it doesn't matter
@index({ username: 1, 'job.company': 1 })
@modelOptions({
  // name of the collection in db
  schemaOptions: {
    collection: 'users',
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      // we generally don't do this in toObject
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
})
@pre<UserClass>('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
})
class UserClass {
  @prop({ required: true, minlength: 3, maxlength: 30 })
  username: string;

  // don't unselect the password here, but do it in the toJSON method
  @prop({ required: true, minlength: 8, maxlength: 30 })
  password: string;

  @prop({ required: true })
  job: Job;

  @prop({
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Please use a valid email',
    },
  })
  email: string;

  get summary() {
    return `${this.username}, ${this.email}, ${this.job.title}`;
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

const User = getModelForClass(UserClass);

export { UserClass, User };
