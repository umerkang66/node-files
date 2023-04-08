import {
  getModelForClass,
  index,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import validator from 'validator';

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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
class UserClass {
  @prop({ required: true, minlength: 3, maxlength: 30 })
  username: string;

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
}

const User = getModelForClass(UserClass);

export { UserClass, User };
