import express from 'express';
import codeTablesController from '../controller/codeTablesController.js';

const router = express.Router();

router.route('/')
    .get(codeTablesController.getAll);

export default router;