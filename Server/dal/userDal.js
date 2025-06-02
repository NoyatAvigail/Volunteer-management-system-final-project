import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';

const userDal = {
    findByEmail: (email) => {
        return Users.findOne({ where: { email } });
    },

    createUser: (userData) => {
        return Users.create(userData);
    },

    savePassword: (userId, hashedPassword) => {
        return Passwords.create({ userId, password: hashedPassword });
    },

    getPasswordByUserId: (userId) => Passwords.findOne({ where: { userId } }),
};

export default userDal;