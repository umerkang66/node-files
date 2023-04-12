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

interface ResetPasswordTokenAttrs {
  owner: string | mongoose.Types.ObjectId;
  token: string;
}

@pre<ResetPasswordTokenClass>('save', async function () {
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
    collection: 'resetPasswordTokens',
  },
})
class ResetPasswordTokenClass {
  @prop({ required: true })
  token: string;

  @prop({ required: true, ref: () => UserClass })
  owner: Ref<UserClass>;

  static build(attrs: ResetPasswordTokenAttrs) {
    // after building this document in the model, it should be saved()
    return new ResetPasswordToken(attrs);
  }
}

const ResetPasswordToken = getModelForClass(ResetPasswordTokenClass);

export { ResetPasswordToken };
