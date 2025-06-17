import express from 'express';
import { getCodeTables } from '../controllers/codeTablesController.js';

const router = express.Router();
router.get('/api/codetables', getCodeTables);

export default router;
