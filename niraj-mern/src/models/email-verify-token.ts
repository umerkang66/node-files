import mongoose from 'mongoose';
import { Password } from '../services/password';

interface EmailVerifyTokenAttrs {
  owner: string | mongoose.ObjectId;
  token: string;
}

type EmailVerifyTokenDocument = mongoose.Document &
  EmailVerifyTokenAttrs & { createdAt: string | number | Date };

type BuildFn = (attrs: EmailVerifyTokenAttrs) => EmailVerifyTokenDocument;

interface EmailVerifyTokenModel
  extends mongoose.Model<EmailVerifyTokenDocument> {
  build: BuildFn;
}

const emailVerifyTokenSchema = new mongoose.Schema({
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
    default: () => Date.now(),
  },
});

emailVerifyTokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    // this doesn't use the bcrypt, because these tokens are not that important
    const hashedToken = Password.hashToken(this.token);
    this.set('token', hashedToken);
  }
  next();
});

emailVerifyTokenSchema.statics.build = function (
  attrs: EmailVerifyTokenAttrs
): EmailVerifyTokenDocument {
  // after building this document in the model, it should be saved()
  return new EmailVerifyToken(attrs);
};

const EmailVerifyToken = mongoose.model<
  EmailVerifyTokenDocument,
  EmailVerifyTokenModel
>('EmailVerifyToken', emailVerifyTokenSchema);

export { EmailVerifyToken, type EmailVerifyTokenDocument };
