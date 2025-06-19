import express from 'express';
import volunteersController from '../controller/volunteersController.js';
import { verifyToken } from '../middleware/middleware.js';

const router = express.Router();

router.use(verifyToken);

router.route('/shifts')
    .get(volunteersController.getShifts)
// .put(volunteersController.updateShift)

router.route('/certificate')
    .get(volunteersController.getCertificate);

export default router;
