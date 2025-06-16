import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const isPasswordValid = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const capitalize = async (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
const SECRET = process.env.EMAIL_TOKEN_SECRET || "your-secret";

export function generateEditToken(userId) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '30m' });
}

export function verifyEditToken(token) {
  return jwt.verify(token, SECRET);
}

