import userService from "../services/userService.js";
import { generateToken } from "../middleware/middleware.js";
import Users from '../Models/Users.js';
import { cUserType } from '../common/consts.js';
import sendEditVerificationMail from '../services/emailService.js';
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

    getAll: async (req, res) => {
        try {
            const { table } = req.params;
            const query = req.query;
            if (Object.keys(query).length > 0) {
                const items = await userService.getItem(table, query);
                return res.status(200).json(items);
            }
            const items = await userService.getAll(table);
            res.status(200).json(items);
        } catch (error) {
            console.error("Error in getAll (generic):", error);
            res.status(500).json({ message: 'Server error', error });
        }
    },

    getByForeignJoin: async (req, res) => {
        try {
            const { table1, foreignKey, table2, targetKey, targetField } = req.params;
            const targetValue = req.query.value;
            if (!targetValue) return res.status(400).json({ message: "Missing target value" });
            const result = await userService.getRequests(table1, foreignKey, table2, targetKey,targetField, targetValue);
            res.status(200).json(result);
        } catch (err) {
            console.error("Error in getByForeignJoin:", err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    post: async (req, res) => {
        try {
            const item = await userService.create(req.params.table, req.body);
            res.status(201).json(item);
        } catch (err) {
            console.error("Error in POST /:table:", err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    getProfile: async (req, res) => {
        try {
            const { userId } = req.params;
            const profile = await userService.getProfile(userId);
            res.json(profile);
        } catch (err) {
            console.error("Get profile error:", err);
            res.status(500).json({ message: err.message || 'Server error' });
        }
    },

    sendEditEmail: async (req, res) => {
        try {
            const { id } = req.params;
            console.log("Received ID:", id);
            //  const user = await userService.getUserById(id);

            const user = await usersDal.getUserById(id);
            console.log("user found:", user);

            if (!user) return res.status(404).send("User not found");
            if (!user.email) return res.status(400).send("User has no email");

            const token = generateEditToken(id);
            console.log("Generated token:", token);

            await sendEditVerificationMail(user.email, token);
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
            // אימות הטוקן וקבלת הפיילוד
            const payload = jwt.verify(code, JWT_SECRET);

            // אפשר להוסיף בדיקה שהפיילוד מתאים למשתמש (לדוגמה userId)
            if (!payload.userId) {
                return res.status(400).send("Invalid token payload");
            }

            // אם הכל תקין
            return res.status(200).send({ message: "Code valid", userId: payload.userId });
        } catch (err) {
            // שגיאה באימות (פג תוקף או טוקן לא חוקי)
            return res.status(400).send("Invalid or expired code");
        }
    },
    // updateProfile: async (req, res) => {
    //     try {
    //         const { userId } = req.params;
    //         const user = await Users.findByPk(userId);
    //         if (!user) return res.status(404).json({ message: 'User not found' });
    //         const data = req.body;
    //         if (user.type === cUserType.VOLUNTEER) {

    //             const updatedVolunteer = await userService.updateVolunteerProfile(userId, data);
    //             res.json({ message: 'Volunteer profile updated', data: updatedVolunteer });
    //         }
    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // },
    updateProfile: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await Users.findByPk(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const data = req.body;

            if (user.type === cUserType.VOLUNTEER) {
                const updatedVolunteer = await userService.updateVolunteerProfile(userId, data);
                return res.json({ message: 'Volunteer profile updated', data: updatedVolunteer });
            }

            if (user.type === cUserType.CONTACTPERSON) {
                const updatedContact = await userService.updateContactProfile(userId, data);
                return res.json({ message: 'Contact profile updated', data: updatedContact });
            }

            return res.status(400).json({ message: 'Unsupported user type' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

};

export default userController;