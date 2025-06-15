import express from 'express';
import userController from '../controller/userController.js';
import { verifyToken, validateUserId } from '../middleware/middleware.js';
const router = express.Router();

router.route('/login')
    .post(userController.login);
router.route('/signup')
    .post(userController.signup);
4
router.use(verifyToken);

router.route('/:type/:userId/:table')
    .all(validateUserId)
    .get(userController.getAll)
    .post(userController.post);

// router.route('/ContactPerson/:id/Patients')
//     .all(validateUserId)
//     .get(userController.getAll)
//     .post(userController.post);

// router.route('/ContactPerson/:id/Patients/:byValue')
//     .all(validateUserId)
//     .get(userController.getByValue)

router.route('/:type/:userId/:table/:id')
    .all(validateUserId);

export default router;