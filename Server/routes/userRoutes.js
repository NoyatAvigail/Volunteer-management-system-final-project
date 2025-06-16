import express from 'express';
import userController from '../controller/userController.js';
import { verifyToken, validateUserId } from '../middleware/middleware.js';
import { verifyEditToken } from '../utils/utils.js';
import verifyEditCode from '../controller/userController.js';


const router = express.Router();

router.route('/login')
    .post(userController.login);
router.route('/signup')
    .post(userController.signup);
4
router.use(verifyToken);

router.route('/profile/:userId')
    .get(userController.getProfile)
    .put(userController.updateProfile);
router.post('/send-edit-email/:id/', userController.sendEditEmail);

router.post('/verify-edit-code', userController.verifyEditCode);

router.route('/:type/:userId/:table')
    .all(validateUserId)
    .get(userController.getAll)
    .post(userController.post);

router.route('/:type/:userId/:table/:id')
    .all(validateUserId);

router.route('/:type/:userId/join-foreign/:table1/:foreignKey/:table2/:targetKey/:targetField')
    .all(validateUserId)
    .get(userController.getByForeignJoin);

export default router;