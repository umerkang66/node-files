export const Keys = {
  signup: '/api/auth/signup',
  adminSignup: '/api/auth/admin-signup',
  confirmAdminSignup: (userId: string, token: string) =>
    `/api/auth/admin-signup/${userId}?token=${token}`,
  confirmSignup: '/api/auth/confirm-signup',
  signin: '/api/auth/signin',
  currentUser: '/api/auth/currentuser',
  signout: '/api/auth/signout',
  resendEmailVerification: '/api/auth/resend-email-verify-token',
  forgotPassword: '/api/auth/forgot-password',
  updateMe: '/api/auth/update-me',
  updatePassword: '/api/auth/update-password',
  deleteMe: '/api/auth/delete-me',
  resetPassword: (token: string, userId: string) =>
    `/api/auth/reset-password?token=${token}&userId=${userId}`,
};
