// import express from 'express';
// import thankYousController from '../controllers/thankYousController.js';

// const router = express.Router();

// router.post('/', thankYousController.addThankYou);

// export default router;
import express from 'express';
import { thankYousController } from '../controller/thankYousController.js';
import { verifyToken } from '../middleware/middleware.js';

const router = express.Router();
router.use(verifyToken);

router.route('/')
    .post(thankYousController.createNote)
    .get(thankYousController.getNotesByFromId);

// .get(thankYousController.getAllNotes);
// router.get('/:contactId', thankYousController.getNotesByFromId);
router.route('/:id')
    .put(thankYousController.updateNote)
    .delete(thankYousController.softDeleteNote);

export default router;
