import nodemailer from 'nodemailer';

const editCodesStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const emailsService = {
  generateSimple: () => {
    const length = Math.floor(Math.random() * 4) + 6;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

    storeEditCode: (userId, code) => {
      editCodesStore.set(userId, {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 דקות
      });
    },

      verifyStoredCode: (userId, inputCode) => {
        const entry = editCodesStore.get(userId);
        if (!entry) return false;
        if (Date.now() > entry.expiresAt) {
          editCodesStore.delete(userId);
          return false;
        }
        const isValid = entry.code === inputCode;
        if (isValid) editCodesStore.delete(userId);
        return isValid;
      },

        sendEditVerificationMail: async (to, code) => {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: 'Verification code for profile editing',
            html: `<p>Your verification code is: <strong>${code}</strong></p><p>The code is valid for 10 minutes.</p>`
          });
        }
  };

  export default emailsService;
