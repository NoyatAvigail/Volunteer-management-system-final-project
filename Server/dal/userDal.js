import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';

const userDAL = {
    findByUsername: (username) => {
        return Users.findOne({ where: { username } });
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