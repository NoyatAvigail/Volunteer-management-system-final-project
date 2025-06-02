import userDal from "../dal/userDal.js";
import { hashPassword, isPasswordValid } from "../utils/utils.js";
import { log } from "../utils/logger.js";


const userService = {
    signup: async (userData) => {
        log('[POST]', { userData });
        const { email, password, ...rest } = userData;
        const existingUser = await userDal.findByEmail(email);
        if (existingUser) {
            throw new Error("Email already taken");
        }
        const newUser = await userDal.createUser({ email, ...rest });
        const hashed = await hashPassword(password);
        const userPassword = await userDal.savePassword(newUser.id, hashed);
        return newUser;
    },

    login: async ({ email, password }) => {
        log('[POST]', { email, password });
        const user = await userDal.findByEmail(email);
        if (!user) return null;
        const passwordEntry = await userDal.getPasswordByUserId(user.id);
        if (!passwordEntry) return null;
        const valid = await isPasswordValid(password, passwordEntry.password);
        console.log(valid);
        return valid ? user : null;
    }
};

export default userService;