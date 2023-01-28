import mongoose from 'mongoose';
import { Password } from '../../services/password';

interface AdminVerifyTokenAttrs {
  owner: string | mongoose.ObjectId;
  token: string;
}

type AdminVerifyTokenDocument = mongoose.Document &
  AdminVerifyTokenAttrs & { createdAt: string | number | Date };

type BuildFn = (attrs: AdminVerifyTokenAttrs) => AdminVerifyTokenDocument;

interface AdminVerifyTokenModel
  extends mongoose.Model<AdminVerifyTokenDocument> {
  build: BuildFn;
}

const adminVerifyTokenSchema = new mongoose.Schema({
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

adminVerifyTokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    // this doesn't use the bcrypt, because these tokens are not that important
    const hashedToken = Password.hashToken(this.token);
    this.set('token', hashedToken);
  }
  next();
});

adminVerifyTokenSchema.statics.build = function (
  attrs: AdminVerifyTokenAttrs
): AdminVerifyTokenDocument {
  // after building this document in the model, it should be saved()
  return new AdminVerifyToken(attrs);
};

const AdminVerifyToken = mongoose.model<
  AdminVerifyTokenDocument,
  AdminVerifyTokenModel
>('AdminVerifyToken', adminVerifyTokenSchema);

export { AdminVerifyToken, type AdminVerifyTokenDocument };
