import express from 'express';
import { thanksController } from '../controller/thanksController.js';
const router = express.Router();

router.route('/')
    .post(thanksController.createNote)
    .get(thanksController.getNotesByFromId);

router.route('/:id')
    .put(thanksController.updateNote)
    .delete(thanksController.softDeleteNote);

export default router;
