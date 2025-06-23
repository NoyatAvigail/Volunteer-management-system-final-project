import express from 'express';
import homeController from '../controller/homeController.js';
const router = express.Router();

router.route('/stats')
    .get(homeController.getStats);

export default router;