import express from 'express';
import requestsController from '../controller/requestsController.js';

const router = express.Router();

router.route('/')
    .get(requestsController.getRequests)
    .post(requestsController.createRequests);
    
router.route('/:id')
    .delete(requestsController.deleteRequests)
    .put(requestsController.updatRequests)

export default router;