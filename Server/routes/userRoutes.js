import express from 'express';
import userController from '../controller/userController.js';
import { verifyToken, validateUserId } from '../middleware/middleware.js';
const router = express.Router();

router.route('/login')
    .post(userController.login);
router.route('/signup')
    .post(userController.signup);

router.use(verifyToken);

export default router;