import userService from "../services/userService.js";
import { generateToken } from "../middleware/middleware.js";

const userController = {
    signup: async (req, res) => {
        console.log("Received signup request:", req.body);
        try {
            const newUser = await userService.signup(req.body);
            const token = generateToken(newUser.id, newUser.fullName, req.body.password);
            return res.status(201).json({
                message: "User successfully registered",
                token,
                user: newUser,
            });
        } catch (e) {
            console.log("Received signup body:", req.body);
            res.status(400).json({ message: e.message });
        }
    },

    login: async (req, res) => {
        try {
            const loginUser = await userService.login(req.body);
            if (!loginUser) return res.status(401).json({ message: 'Invalid credentials' });
            const token = generateToken(loginUser.id, loginUser.email, req.body.password);
            return res.status(201).json({
                message: "User successfully registered",
                token,
                user: loginUser,
            });
        } catch (e) {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export default userController;