import express from 'express';
import requestsController from '../controller/requestsController.js';

const router = express.Router();

router.route('/')
    .get(requestsController.getRequests)
    .post(requestsController.createRequest);
    
router.route('/:id')
    .delete(requestsController.deleteRequest)
    .put(requestsController.updatRequest)

export default router;