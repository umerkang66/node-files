import mongoose from 'mongoose';
import {
  Ref,
  getModelForClass,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';
import { UserClass } from '../user';
import { Password } from '../../services/password';

interface EmailVerifyTokenAttrs {
  owner: string | mongoose.Types.ObjectId;
  token: string;
}

@pre<EmailVerifyTokenClass>('save', async function () {
  if (this.isModified('token')) {
    // this doesn't use the bcrypt, because these tokens are not that important
    const hashedToken = Password.hashToken(this.token);
    this.set('token', hashedToken);
  }
})
@modelOptions({
  // in seconds -> 1 Hour
  schemaOptions: {
    timestamps: true,
    expires: 3600,
    collection: 'emailVerifyTokens',
  },
})
class EmailVerifyTokenClass {
  @prop({ required: true })
  token: string;

  @prop({ required: true, ref: () => UserClass })
  owner: Ref<UserClass>;

  static build(attrs: EmailVerifyTokenAttrs) {
    // after building this document in the model, it should be saved()
    return new EmailVerifyToken(attrs);
  }
}

const EmailVerifyToken = getModelForClass(EmailVerifyTokenClass);

export { EmailVerifyToken };
