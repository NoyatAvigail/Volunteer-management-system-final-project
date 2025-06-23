import express from 'express';
import { thanksController } from '../controller/thanksController.js';
import { verifyToken } from '../middleware/middleware.js';

const router = express.Router();
router.use(verifyToken);

router.route('/')
    .post(thanksController.createNote)
    .get(thanksController.getNotesByFromId);

// .get(thankYousController.getAllNotes);
// router.get('/:contactId', thankYousController.getNotesByFromId);
router.route('/:id')
    .put(thanksController.updateNote)
    .delete(thanksController.softDeleteNote);

export default router;
