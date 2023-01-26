import mongoose from 'mongoose';
import { Password } from '../../services/password';

interface ResetPasswordTokenAttrs {
  owner: string | mongoose.ObjectId;
  token: string;
}

type ResetPasswordTokenDocument = mongoose.Document &
  ResetPasswordTokenAttrs & { createdAt: string | number | Date };

type BuildFn = (attrs: ResetPasswordTokenAttrs) => ResetPasswordTokenDocument;

interface ResetPasswordTokenModel
  extends mongoose.Model<ResetPasswordTokenDocument> {
  build: BuildFn;
}

const resetPasswordTokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    // This id belongs to this model 'User'
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    // if type is date, it can have expires property
    // now this document will expires after
    expires: 3600, // in seconds -> 1 Hour
    default: () => Date.now(), // we can also write it as 'Date.now' as func
  },
});

resetPasswordTokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    // this doesn't use the bcrypt, because these tokens are not that important
    const hashedToken = Password.hashToken(this.token);
    this.set('token', hashedToken);
  }
  next();
});

resetPasswordTokenSchema.statics.build = function (
  attrs: ResetPasswordTokenAttrs
): ResetPasswordTokenDocument {
  // after building this document in the model, it should be saved()
  return new ResetPasswordToken(attrs);
};

const ResetPasswordToken = mongoose.model<
  ResetPasswordTokenDocument,
  ResetPasswordTokenModel
>('ResetPasswordToken', resetPasswordTokenSchema);

export { ResetPasswordToken, type ResetPasswordTokenDocument };
