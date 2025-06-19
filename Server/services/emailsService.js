import nodemailer from 'nodemailer';

const emailsService = {
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }),

  sendEditVerificationMail: async (to, code) => {
    await emailsService.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Verification code for profile editing',
      html: `<p>Your verification code is: <strong>${code}</strong></p><p>The code is valid for 10 minutes.</p>`
    });
  }
};

export default emailsService;
