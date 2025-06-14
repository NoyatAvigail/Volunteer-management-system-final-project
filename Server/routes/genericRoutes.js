import express from 'express';
import genericController from '../controller/genericController.js';
const router = express.Router();

router.route('/:table')
    .get(genericController.getAll)

export default router;