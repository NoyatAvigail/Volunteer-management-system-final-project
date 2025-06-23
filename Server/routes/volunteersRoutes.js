import express from 'express';
import volunteersController from '../controller/volunteersController.js';
const router = express.Router();

router.route('/shifts')
    .get(volunteersController.getShifts)

router.route('/certificate')
    .get(volunteersController.getCertificate);

export default router;