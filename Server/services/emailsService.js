// import nodemailer from 'nodemailer';

// const editCodesStore = new Map();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// function formatDate(date) {
//   return new Date(date).toLocaleDateString('en-US');
// }

// function formatToGoogleCalendarDate(date, startTime, endTime) {
//   const d = new Date(date);
//   const [sh, sm] = startTime.split(':');
//   const [eh, em] = endTime.split(':');
//   const start = new Date(d.setHours(sh, sm)).toISOString().replace(/-|:|\.\d\d\d/g, '');
//   const end = new Date(d.setHours(eh, em)).toISOString().replace(/-|:|\.\d\d\d/g, '');
//   return `${start}/${end}`;
// }

// const emailsService = {
//   generateSimple: () => {
//     const length = Math.floor(Math.random() * 4) + 6;
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let code = '';
//     for (let i = 0; i < length; i++) {
//       code += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return code;
//   },

//   storeEditCode: (userId, code) => {
//     editCodesStore.set(userId, {
//       code,
//       expiresAt: Date.now() + 10 * 60 * 1000 
//     });
//   },

//   verifyStoredCode: (userId, inputCode) => {
//     const entry = editCodesStore.get(userId);
//     if (!entry) return false;
//     if (Date.now() > entry.expiresAt) {
//       editCodesStore.delete(userId);
//       return false;
//     }
//     const isValid = entry.code === inputCode;
//     if (isValid) editCodesStore.delete(userId);
//     return isValid;
//   },

//   sendEditVerificationMail: async (to, code) => {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject: 'Verification code for profile editing',
//       html: `<p>Your verification code is: <strong>${code}</strong></p><p>The code is valid for 10 minutes.</p>`
//     });
//   },

//   sendVolunteerAssignmentEmail: async (to, { volunteerName, date, startTime, endTime, hospital, department, room, patientName }) => {
//     const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Volunteer+Shift+at+${hospital}&dates=${formatToGoogleCalendarDate(date, startTime, endTime)}&details=Patient:+${patientName}&location=${hospital}`;
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject: 'Your Volunteer Shift Details',
//       html: `
//       <p>Dear ${volunteerName},</p>
//       <p>You have been assigned to a shift with the following details:</p>
//       <ul>
//         <li><strong>Patient:</strong> ${patientName}</li>
//         <li><strong>Hospital:</strong> ${hospital}</li>
//         <li><strong>Department:</strong> ${department}</li>
//         <li><strong>Room:</strong> ${room}</li>
//         <li><strong>Date:</strong> ${formatDate(date)}</li>
//         <li><strong>Time:</strong> ${startTime} - ${endTime}</li>
//       </ul>
//       <p><a href="${googleCalendarLink}">➕ Add to Google Calendar</a></p>
//     `
//     });
//   },

//   sendContactNotificationEmail: async (to, { contactName, volunteerName, volunteerPhone, date, startTime, endTime }) => {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject: 'A Volunteer Was Assigned',
//       html: `
//       <p>Dear ${contactName},</p>
//       <p>We have successfully assigned a volunteer to your event.</p>
//       <ul>
//         <li><strong>Volunteer:</strong> ${volunteerName}</li>
//         <li><strong>Phone:</strong> ${volunteerPhone}</li>
//         <li><strong>Date:</strong> ${formatDate(date)}</li>
//         <li><strong>Time:</strong> ${startTime} - ${endTime}</li>
//       </ul>
//     `
//     });
//   },

//     sendVolunteerShiftUpdatedEmail: async (
//     to,
//     {
//       volunteerName,
//       date,
//       startTime,
//       endTime,
//       hospital,
//       department,
//       room,
//       patientName,
//       contactName,
//       contactEmail,
//       contactPhone
//     }
//   ) => {
//     const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Updated+Volunteer+Shift+at+${hospital}&dates=${formatToGoogleCalendarDate(date, startTime, endTime)}&details=Patient:+${patientName}&location=${hospital}`;

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject: 'Your Volunteer Shift Was Updated',
//       html: `
//       <p>Dear ${volunteerName},</p>
//       <p>Please note that the details of your volunteer shift have been <strong>updated</strong>:</p>
//       <ul>
//         <li><strong>Patient:</strong> ${patientName}</li>
//         <li><strong>Hospital:</strong> ${hospital}</li>
//         <li><strong>Department:</strong> ${department}</li>
//         <li><strong>Room:</strong> ${room}</li>
//         <li><strong>Date:</strong> ${formatDate(date)}</li>
//         <li><strong>Time:</strong> ${startTime} - ${endTime}</li>
//       </ul>
//       <p><a href="${googleCalendarLink}">➕ Add to Google Calendar</a></p>
//       <p>If you are unable to attend the shift, please inform the contact person:</p>
//       <ul>
//         <li><strong>Contact Name:</strong> ${contactName}</li>
//         <li><strong>Email:</strong> ${contactEmail}</li>
//         <li><strong>Phone:</strong> ${contactPhone}</li>
//       </ul>
//       <p>Thank you for your commitment!</p>
//     `
//     });
//   },

// };

// export default emailsService;
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

const logoURL = 'https://raw.githubusercontent.com/NoyatAvigail/FinalProject/main/Client/src/style/img/logo2.png';

const styledHeader = `
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="${logoURL}" alt="Logo" style="max-width: 180px; height: auto;" />
  </div>
`;

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
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
          ${styledHeader}
          <h2 style="color: #5fa79b;">Verification Code</h2>
          <p style="font-size: 16px;">Your verification code is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #e06eb2; margin: 10px 0;">${code}</div>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `
    });
  },

  sendVolunteerAssignmentEmail: async (to, { volunteerName, date, startTime, endTime, hospital, department, room, patientName }) => {
    const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Volunteer+Shift+at+${hospital}&dates=${formatToGoogleCalendarDate(date, startTime, endTime)}&details=Patient:+${patientName}&location=${hospital}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your Volunteer Shift Details',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
          ${styledHeader}
          <h2 style="color: #5fa79b;">Hello ${volunteerName},</h2>
          <p>You have been assigned to a volunteer shift with the following details:</p>
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr style="background-color: #ffbd59;">
              <th style="padding: 8px; text-align: left;">Detail</th>
              <th style="padding: 8px; text-align: left;">Info</th>
            </tr>
            <tr><td style="padding: 8px;">Patient</td><td style="padding: 8px;">${patientName}</td></tr>
            <tr><td style="padding: 8px;">Hospital</td><td style="padding: 8px;">${hospital}</td></tr>
            <tr><td style="padding: 8px;">Department</td><td style="padding: 8px;">${department}</td></tr>
            <tr><td style="padding: 8px;">Room</td><td style="padding: 8px;">${room}</td></tr>
            <tr><td style="padding: 8px;">Date</td><td style="padding: 8px;">${formatDate(date)}</td></tr>
            <tr><td style="padding: 8px;">Time</td><td style="padding: 8px;">${startTime} - ${endTime}</td></tr>
          </table>
          <div style="margin-top: 20px; text-align: center;">
            <a href="${googleCalendarLink}" style="padding: 12px 20px; background-color: #e06eb2; color: #fff; text-decoration: none; border-radius: 5px;">➕ Add to Google Calendar</a>
          </div>
          <p style="margin-top: 20px; text-align: center; color: #f15a3c;">Thank you for your dedication!</p>
        </div>
      `
    });
  },

  sendContactNotificationEmail: async (to, { contactName, volunteerName, volunteerPhone, date, startTime, endTime }) => {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'A Volunteer Was Assigned',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          ${styledHeader}
          <h2 style="color: #f15a3c;">Dear ${contactName},</h2>
          <p>A volunteer has been successfully assigned to your request.</p>
          <ul style="line-height: 1.6;">
            <li><strong>Volunteer:</strong> ${volunteerName}</li>
            <li><strong>Phone:</strong> ${volunteerPhone}</li>
            <li><strong>Date:</strong> ${formatDate(date)}</li>
            <li><strong>Time:</strong> ${startTime} - ${endTime}</li>
          </ul>
        </div>
      `
    });
  },

  sendVolunteerShiftUpdatedEmail: async (
    to,
    {
      volunteerName,
      date,
      startTime,
      endTime,
      hospital,
      department,
      room,
      patientName,
      contactName,
      contactEmail,
      contactPhone
    }
  ) => {
    const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Updated+Volunteer+Shift+at+${hospital}&dates=${formatToGoogleCalendarDate(date, startTime, endTime)}&details=Patient:+${patientName}&location=${hospital}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your Volunteer Shift Was Updated',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          ${styledHeader}
          <h2 style="color: #f15a3c;">Hello ${volunteerName},</h2>
          <p>Your volunteer shift has been <strong>updated</strong>:</p>
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr><td style="padding: 8px;">Patient</td><td style="padding: 8px;">${patientName}</td></tr>
            <tr><td style="padding: 8px;">Hospital</td><td style="padding: 8px;">${hospital}</td></tr>
            <tr><td style="padding: 8px;">Department</td><td style="padding: 8px;">${department}</td></tr>
            <tr><td style="padding: 8px;">Room</td><td style="padding: 8px;">${room}</td></tr>
            <tr><td style="padding: 8px;">Date</td><td style="padding: 8px;">${formatDate(date)}</td></tr>
            <tr><td style="padding: 8px;">Time</td><td style="padding: 8px;">${startTime} - ${endTime}</td></tr>
          </table>
          <div style="margin-top: 20px; text-align: center;">
            <a href="${googleCalendarLink}" style="padding: 12px 20px; background-color: #5fa79b; color: #fff; text-decoration: none; border-radius: 5px;">➕ Add to Google Calendar</a>
          </div>
          <p style="margin-top: 20px;">If you cannot attend, please contact:</p>
          <ul style="line-height: 1.6;">
            <li><strong>Name:</strong> ${contactName}</li>
            <li><strong>Email:</strong> ${contactEmail}</li>
            <li><strong>Phone:</strong> ${contactPhone}</li>
          </ul>
        </div>
      `
    });
  }
};

export default emailsService;