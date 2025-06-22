import userService from "../services/usersService.js";
import { generateToken } from "../middleware/middleware.js";
import emailsService from '../services/emailsService.js';

const userController = {
    signup: async (req, res) => {
        try {
            const newUser = await userService.signup(req.body);
            const token = generateToken(newUser.id, newUser.email, newUser.type);
            console.log("User created successfully:", newUser, "Token generated:", token);
            return res.status(201).json({
                message: "User successfully registered",
                token,
                user: newUser,
            });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },

    login: async (req, res) => {
        try {
            const loginUser = await userService.login(req.body);
            if (!loginUser) return res.status(401).json({ message: 'Invalid credentials' });
            const token = generateToken(loginUser.user.autoId, loginUser.user.email, loginUser.user.type);
            console.log("User logged in successfully:", loginUser, "Token generated:", token);
            return res.status(201).json({
                message: "User successfully registered",
                token,
                user: loginUser,
            });
        } catch (e) {
            res.status(500).json({ message: 'Server error' }, e);
        }
    },

    sendEditEmail: async (req, res) => {
        try {
            const authenticatedId = req.user.id?.toString();
            const authenticatedEmail = req.user.email?.toString();
            if (!authenticatedId || !authenticatedEmail)
                return res.status(400).send("Missing user ID or email");
            const code = emailsService.generateSimple();
            emailsService.storeEditCode(authenticatedId, code);
            await emailsService.sendEditVerificationMail(authenticatedEmail, code);
            res.send("Email sent");
        } catch (err) {
            console.error("Error sending edit email:", err);
            res.status(500).send("Internal Server Error");
        }
    },

    verifyEditCode: async (req, res) => {
        try {
            const { code } = req.body;
            const authenticatedId = req.user.id?.toString();
            if (!code || !authenticatedId)
                return res.status(400).send("Missing code or user ID");
            const isValid = emailsService.verifyStoredCode(authenticatedId, code);
            if (!isValid) {
                return res.status(400).send("Invalid or expired code");
            }
            res.status(200).send({ message: "Code valid" });
        } catch (err) {
            console.error("Error verifying code:", err);
            res.status(500).send("Internal Server Error");
        }
    }
};

export default userController;