import express from 'express';
import userController from '../controller/userController.js';
import genericController from '../controller/genericConterller.js';
import { verifyToken, validateUserId } from '../middleware/middleware.js';
// import { swaggerUi } from '../swagger.js';
const router = express.Router();

router.route('/login')
    .post(userController.login);
router.route('/signup')
    .post(userController.signup);

router.use(verifyToken);

router.route('/:type/:userId/:table')
    .all(validateUserId)
    .get(genericController.getAll)
    .get(genericController.getByValue)
    .post(genericController.post);

router.route('/:type/:userId/:baseTable/:id/:table')
    .all(validateUserId)
    .get(genericController.getNested)
    .post(genericController.post)
    .patch(genericController.update)
    .delete(genericController.softDelete);

router.route('/:type/:userId/:table/:id')
    .all(validateUserId)
    .patch(genericController.update)
    .delete(genericController.softDelete);

export default router;