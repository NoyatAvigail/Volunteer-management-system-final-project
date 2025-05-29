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