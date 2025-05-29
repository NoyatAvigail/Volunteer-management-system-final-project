import userDAL from "../dal/userDal.js";
import { hashPassword, isPasswordValid } from "../utils/utils.js";
import { log } from "../utils/logger.js";


const userService = {
    signup: async (userData) => {
        log('[POST]', { userData });
        const { username, password, ...rest } = userData;
        const existingUser = await userDAL.findByUsername(username);
        if (existingUser) {
            throw new Error("Username already taken");
        }
        const newUser = await userDAL.createUser({ username, ...rest });
        const hashed = await hashPassword(password);
        const userPassword = await userDAL.savePassword(newUser.id, hashed);
        return newUser;
    },

    login: async ({ username, password }) => {
        log('[POST]', { username, password });
        const user = await userDAL.findByUsername(username);
        if (!user) return null;
        const passwordEntry = await userDAL.getPasswordByUserId(user.id);
        if (!passwordEntry) return null;
        const valid = await isPasswordValid(password, passwordEntry.Password);
        console.log(valid);
        return valid ? user : null;
    }
};

export default userService;