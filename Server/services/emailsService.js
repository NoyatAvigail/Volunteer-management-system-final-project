import nodemailer from 'nodemailer';

const editCodesStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US');
}

function formatToGoogleCalendarDate(date, startTime, endTime) {
  const d = new Date(date);
  const [sh, sm] = startTime.split(':');
  const [eh, em] = endTime.split(':');
  const start = new Date(d.setHours(sh, sm)).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const end = new Date(d.setHours(eh, em)).toISOString().replace(/-|:|\.\d\d\d/g, '');
  return `${start}/${end}`;
}

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
      expiresAt: Date.now() + 10 * 60 * 1000 
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
  },
  
  sendVolunteerAssignmentEmail: async (to, { volunteerName, date, startTime, endTime, hospital, department, room, patientName }) => {
    const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Volunteer+Shift+at+${hospital}&dates=${formatToGoogleCalendarDate(date, startTime, endTime)}&details=Patient:+${patientName}&location=${hospital}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your Volunteer Shift Details',
      html: `
      <p>Dear ${volunteerName},</p>
      <p>You have been assigned to a shift with the following details:</p>
      <ul>
        <li><strong>Patient:</strong> ${patientName}</li>
        <li><strong>Hospital:</strong> ${hospital}</li>
        <li><strong>Department:</strong> ${department}</li>
        <li><strong>Room:</strong> ${room}</li>
        <li><strong>Date:</strong> ${formatDate(date)}</li>
        <li><strong>Time:</strong> ${startTime} - ${endTime}</li>
      </ul>
      <p><a href="${googleCalendarLink}">➕ Add to Google Calendar</a></p>
    `
    });
  },

  sendContactNotificationEmail: async (to, { contactName, volunteerName, volunteerPhone, date, startTime, endTime }) => {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'A Volunteer Was Assigned',
      html: `
      <p>Dear ${contactName},</p>
      <p>We have successfully assigned a volunteer to your event.</p>
      <ul>
        <li><strong>Volunteer:</strong> ${volunteerName}</li>
        <li><strong>Phone:</strong> ${volunteerPhone}</li>
        <li><strong>Date:</strong> ${formatDate(date)}</li>
        <li><strong>Time:</strong> ${startTime} - ${endTime}</li>
      </ul>
    `
    });
  }
};

export default emailsService;