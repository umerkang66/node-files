import mongoose from 'mongoose';
import { Password } from '../services/password';
import { AdminVerifyToken } from '../models/tokens/admin-verify-token';
import { EmailVerifyToken } from '../models/tokens/email-verify-token';
import { ResetPasswordToken } from '../models/tokens/reset-password-token';

type UserId = string | mongoose.Types.ObjectId;
// AdminVerityToken
export async function addAdminVerifyToken(userId: UserId) {
  const token = Password.createToken();

  await AdminVerifyToken.build({ owner: userId, token }).save();

  return token;
}

export async function checkAdminVerifyToken(userId: UserId, token: string) {
  const foundToken = await AdminVerifyToken.findOne({
    owner: userId,
    token: Password.hashToken(token),
  });

  return foundToken;
}

export async function addEmailVerifyToken(userId: UserId) {
  // this will create a 8 digit token
  const token = Password.createToken(4);

  await EmailVerifyToken.build({ token, owner: userId }).save();

  return token;
}

export async function checkEmailVerifyToken(userId: UserId, token: string) {
  const foundToken = await EmailVerifyToken.findOne({
    token: Password.hashToken(token),
    owner: userId,
  });

  return foundToken;
}

export async function addResetPasswordToken(userId: UserId) {
  const token = Password.createToken();

  await ResetPasswordToken.build({ owner: userId, token }).save();

  return token;
}

export async function checkResetPasswordToken(userId: UserId, token: string) {
  const foundToken = await ResetPasswordToken.findOne({
    owner: userId,
    token: Password.hashToken(token),
  });

  return foundToken;
}
