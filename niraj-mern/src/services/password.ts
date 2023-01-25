import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export class Password {
  public static async toHash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  }

  public static compare(
    password: string,
    userPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }

  public static createToken(numOfBytes: number = 32): string {
    const token = crypto.randomBytes(numOfBytes).toString('hex');

    return token;
  }

  public static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
