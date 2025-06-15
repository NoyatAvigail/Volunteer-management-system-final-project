import userService from "../services/userService.js";
import { generateToken } from "../middleware/middleware.js";

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
            res.status(500).json({ message: 'Server error' });
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
};

export default userController;