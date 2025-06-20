import userService from "../services/usersService.js";
import { generateToken } from "../middleware/middleware.js";
import emailsService from '../services/emailsService.js';
import { generateEditToken } from '../utils/utils.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const userController = {
    signup: async (req, res) => {
        try {
            const newUser = await userService.signup(req.body);
            console.log("New user created:", newUser);
            const token = generateToken(newUser.id, newUser.email, newUser.type);
            console.log("User created successfully:", newUser, "Token generated:", token);
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
            console.log("Login user found:", loginUser);
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
            console.log("sendEditEmail");
            
            const authenticatedId = req.user.id?.toString();
            const authenticatedEmail = req.user.email?.toString();
            console.log("Received ID:", authenticatedId);
            console.log("Email to send:", authenticatedEmail);

            if (!authenticatedEmail) return res.status(400).send("Email is required");

            const token = generateEditToken(authenticatedId);
            console.log("Generated token:", token);

            await emailsService.sendEditVerificationMail(authenticatedEmail, token);
            console.log("Email sent successfully");

            res.send("Email sent");
        } catch (err) {
            console.error("Error sending edit email:", err);
            res.status(500).send("Internal Server Error");
        }
    },

    verifyEditCode: async (req, res) => {
        const { code } = req.body;

        if (!code) {
            return res.status(400).send("Missing code");
        }

        try {
            const payload = jwt.verify(code, JWT_SECRET);

            if (!payload.userId) {
                return res.status(400).send("Invalid token payload");
            }

            return res.status(200).send({ message: "Code valid", userId: payload.userId });
        } catch (err) {
            return res.status(400).send("Invalid or expired code");
        }
    },
};

export default userController;