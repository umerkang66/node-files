import { mailer } from './mailer';

const sendEmailVerificationMail = async (token: string, to: string) => {
  await mailer.sendMail({
    from: 'verification@reviewapp.com',
    to,
    subject: 'Email Verification (valid only for 1 Hour)',
    html: `
      <p>Your verification OTP (valid only for 1 Hour)</p>
      <h3>${token}</h3>
    `,
  });
};

const sendResetPasswordTokenMail = async (url: string, to: string) => {
  await mailer.sendMail({
    from: 'reset-password@reviewapp.com',
    to,
    subject: 'Reset Your Password (valid only for 1 Hour)',
    html: `
      <div>
        <h5>This is valid only for 1 Hour</h5>
        <a href="${url}"><h3>Reset Your Password</h3></a>
      </div>
    `,
  });
};

const sendAdminVerifyTokenMail = async (url: string, to: string) => {
  await mailer.sendMail({
    from: 'admin-verify@reviewapp.com',
    to,
    subject: 'Verify as Admin (valid only for 1 Hour)',
    html: `
      <div>
        <h5>This is valid only for 1 Hour</h5>
        <a href="${url}"><h3>Verify as Admin</h3></a>
      </div>
    `,
  });
};

export {
  sendEmailVerificationMail,
  sendResetPasswordTokenMail,
  sendAdminVerifyTokenMail,
};
