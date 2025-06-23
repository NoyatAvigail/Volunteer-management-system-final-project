import express from 'express';
import referenceDataController from '../controller/referenceDataController.js';

const router = express.Router();

router.route('/')
    .get(referenceDataController.getAll);

export default router;