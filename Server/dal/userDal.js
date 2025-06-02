import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';

const userDAL = {
    findByEmail: (email) => {
        return Users.findOne({ where: { email } });
    },

    createUser: (userData) => {
        return Users.create(userData);
    },

    savePassword: (userId, hashedPassword) => {
        return Passwords.create({ userId, Password: hashedPassword });
    },

    getPasswordByUserId: (userId) => Passwords.findOne({ where: { userId } }),
};

export default userDAL;