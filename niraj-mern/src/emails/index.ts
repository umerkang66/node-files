import { mailer } from './mailer';

const sendEmailVerificationMail = async (token: string, to: string) => {
  await mailer.sendMail({
    from: 'verification@reviewapp.com',
    to,
    subject: 'Email Verification',
    html: `
      <p>Your verification OTP</p>
      <h3>${token}</h3>
    `,
  });
};

export { sendEmailVerificationMail };
