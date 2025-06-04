import express from 'express';
import genericController from '../controller/genericConterller.js';
import { verifyToken, validateUserId } from '../middleware/middleware.js';
const router = express.Router();
router.use(verifyToken);

router.route('/:type/:userId/:table')
    .all(validateUserId)
    .get(genericController.getAllOrByValue)
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