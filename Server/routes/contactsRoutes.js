import express from 'express';
import contactController from '../controller/contactsController.js';
const router = express.Router();

router.route('/thanks')
    .get(contactController.getThanks)
    .post(contactController.createThanks);

export default router;