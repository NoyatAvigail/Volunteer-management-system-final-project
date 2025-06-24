import express from 'express';
import homeController from '../controller/homeController.js';
const router = express.Router();

router.route('/')
    .get(homeController.getHome);

export default router;