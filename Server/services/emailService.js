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
    subject: 'קוד אימות לעריכת פרופיל',
    html: `<p>קוד האימות שלך הוא: <strong>${code}</strong></p>
           <p>הקוד בתוקף ל־10 דקות.</p>`
  });
}

