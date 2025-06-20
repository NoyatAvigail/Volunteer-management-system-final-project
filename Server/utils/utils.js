import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const isPasswordValid = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const capitalize = async (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
// const SECRET = process.env.EMAIL_TOKEN_SECRET || "your-secret";

// export function generateSimpleCode() {
//   const length = Math.floor(Math.random() * 4) + 6; 
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let code = '';
//   for (let i = 0; i < length; i++) {
//     code += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return code;
// }


// export function verifyEditToken(token) {
//   return jwt.verify(token, SECRET);
// }

