import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';

const userDal = {
    findByEmail: (email) => {
        return Users.findOne({ where: { email } });
    },

    createUser: (userData) => {
        return Users.create(userData);
    },

    savePassword: (id, hashedPassword) => {
        console.log('Saving password for userId:', id, 'with hashed password:', hashedPassword);
        return Passwords.create({ id, password: hashedPassword });
    },

    getPasswordByUserId: (id) => Passwords.findOne({ where: { id } }),
};

export default userDal;