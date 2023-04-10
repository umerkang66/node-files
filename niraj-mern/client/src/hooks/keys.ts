export const Keys = {
  signup: '/api/auth/signup',
  confirmSignup: '/api/auth/confirm-signup',
  signin: '/api/auth/signin',
  currentUser: '/api/auth/currentuser',
  signout: '/api/auth/signout',
  resendEmailVerification: '/api/auth/resend-email-verify-token',
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: (token: string, userId: string) =>
    `/api/auth/reset-password?token=${token}&userId=${userId}`,
};
