import express from 'express';
import requestsController from '../controller/requestsController.js';

const router = express.Router();

router.route('/')
    .get(requestsController.getContactRequests);

export default router;