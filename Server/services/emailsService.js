import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default async function sendEditVerificationMail(to, code) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    Subject: 'Verification code for profile editing',
    html: `<p>Your verification code is: <strong>${code}</strong></p><p>The code is valid for 10 minutes.</p>`
  });
}